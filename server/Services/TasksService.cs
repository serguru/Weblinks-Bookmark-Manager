using server.Common;
using server.Data;
using System.Text.Json;

namespace server.Services;

public class TasksService(IServiceScopeFactory scopeFactory) : IHostedService, IDisposable
{
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private Timer? _timer;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
    }

    private async void DoWork(object state)
    {
        using var scope = _scopeFactory.CreateScope();
        var tasksRepository = scope.ServiceProvider.GetRequiredService<ITasksRepository>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        var accountRepository = scope.ServiceProvider.GetRequiredService<IAccountsRepository>();

        var operTasks = await tasksRepository.OperTasksAsync(WeblinksTaskType.Send_reg_email);

        foreach (var task in operTasks)
        {
            try
            {
                var account = accountRepository.GetAccountByEmailAsync(task.History.UserEmail!).Result;

                if (account == null)
                {
                    continue;
                }

                var toName = account.FirstName + " " + account.LastName;
                var subject = "test subject";
                var body = "test body";

                await emailService.SendEmailAsync(toName, account.UserEmail, subject, body);
                var obj = new
                {
                    Subject = subject,
                    Body = body
                };

                var comment = JsonSerializer.Serialize(obj);
                await tasksRepository.ArchiveOperTask(task.Id, comment);
            }
            catch (Exception ex) 
            { 
                Console.WriteLine(ex.ToString());
            }
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
