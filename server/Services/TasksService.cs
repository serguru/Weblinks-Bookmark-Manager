using server.Common;
using server.Data;
using server.Data.Entities;
using System.Configuration;
using System.Text.Json;
using System.Xml.Linq;

namespace server.Services;

public class TasksService(IServiceScopeFactory scopeFactory, IConfiguration configuration) : IHostedService, IDisposable
{
    private readonly IConfiguration _configuration = configuration;
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private Timer? _timer;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        int interval = Convert.ToInt32(_configuration["TasksService:IntervalInMinutes"]);
        _timer = new Timer(DoWork!, null, TimeSpan.Zero, TimeSpan.FromMinutes(interval));
    }

    private async void DoWork(object state)
    {
        using var scope = _scopeFactory.CreateScope();
        var tasksRepository = scope.ServiceProvider.GetRequiredService<ITasksRepository>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        var accountRepository = scope.ServiceProvider.GetRequiredService<IAccountsRepository>();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();

        var operTasks = await tasksRepository.OperTasksAsync();

        foreach (var task in operTasks)
        {
            bool taskArchived = false;
            string toName = "";
            Account? account = null;
            string body = "";
            string subject = "";
            try
            {
                account = accountRepository.GetAccountByEmailAsync(task.History.UserEmail!).Result;

                if (account == null)
                {
                    await tasksRepository.ArchiveOperTask(task.Id, "Account not found", "", "");
                    continue;
                }

                toName = account.FirstName + " " + account.LastName;
                List<KeyValuePair<string, string>> fields =
                    [
                        new KeyValuePair<string, string>("Name", toName)
                    ];

                if (task.TaskTypeId == (int)WeblinksTaskType.Send_forgot_email) 
                {
                    string origin = _configuration["JwtSettings:Issuer"]!;
                    var token = tokenService.GenerateToken(account, 60);
                    string link = $"{origin}/reset-password/{token}";
                    fields.Add(new KeyValuePair<string, string>("ResetPasswordLink", link));
                }

                body = emailService.PrepareTemplateForSending(fields, task.TaskType.EmailTemplate!);
                subject = task.TaskType.EmailSubject!;
                await tasksRepository.ArchiveOperTask(task.Id, "", subject, body);
                taskArchived = true;
            }
            catch (Exception ex)
            {

            }

            if (!taskArchived)
            {
                return;
            }
            await emailService.SendEmailAsync(toName, account!.UserEmail, subject, body);
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
