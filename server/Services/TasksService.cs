using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using server.Common;
using server.Data;
using server.Data.Entities;
using server.Data.Models;
using System.Net;

namespace server.Services;

public class TasksService(IServiceScopeFactory scopeFactory, 
    IConfiguration configuration) : BackgroundService
{
    private readonly IConfiguration _configuration = configuration;
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly CancellationTokenSource _stoppingCts = new(); // For graceful shutdown

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var tasksRepository = scope.ServiceProvider.GetRequiredService<ITasksRepository>();
        SystemInfo systemInfo = await tasksRepository.AddSystemInfoAsync("Tasks service ExecuteAsync called");

        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await DoWork();
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                var exception = new JObject
                {
                    ["Message"] = ex.Message,
                    ["StackTrace"] = ex.StackTrace,
                    ["InnerException"] = ex.InnerException?.Message
                };
                await emailService.SendEmailToAdminAsync("Task exception",
                    JsonConvert.SerializeObject(exception));
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
            await Task.Delay(TimeSpan.FromMinutes(Convert.ToInt32(_configuration["TasksService:IntervalInMinutes"])), cancellationToken);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var tasksRepository = scope.ServiceProvider.GetRequiredService<ITasksRepository>();
        SystemInfo systemInfo = await tasksRepository.AddSystemInfoAsync("Tasks service StopAsync called");
        await base.StopAsync(cancellationToken);
    }

    private async Task DoWork()
    {
        using var scope = _scopeFactory.CreateScope();
        var tasksRepository = scope.ServiceProvider.GetRequiredService<ITasksRepository>();

        SystemInfo systemInfo = await tasksRepository.AddAliveStartAsync();


        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
        var accountRepository = scope.ServiceProvider.GetRequiredService<IAccountsRepository>();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();

        var operTasks = await tasksRepository.OperTasksAsync();

        foreach (var task in operTasks)
        {
            string toName = "";
            Account? account = null;
            string body = "";
            string subject = "";
            account = accountRepository.GetAccountByEmailAsync(task.History.UserEmail!).Result;

            if (account == null)
            {
                await tasksRepository.ArchiveOperTask(task.Id, $"Account with email {task.History.UserEmail} not found", "", "");
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
                var f = new ForgotPasswordModel()
                {
                    Email = account.UserEmail,
                    UtcTimeIssued = DateTime.UtcNow,
                    ExpiresInMinutes = 60
                };
                var token = JsonConvert.SerializeObject(f);
                token = tokenService.EncryptString(token);
                token = WebUtility.UrlEncode(token);
                string link = $"{origin}/reset-password?t={token}";
                fields.Add(new KeyValuePair<string, string>("ResetPasswordLink", link));
            }

            body = emailService.PrepareTemplateForSending(fields, task.TaskType.EmailTemplate!);
            subject = task.TaskType.EmailSubject!;
            await tasksRepository.ArchiveOperTask(task.Id, "", subject, body);
            await emailService.SendEmailAsync(toName, account!.UserEmail, subject, body);
            if (task.TaskTypeId == (int)WeblinksTaskType.Send_register_email)
            {
                await emailService.SendEmailToAdminAsync("User registered",
                    JsonConvert.SerializeObject(account));
            }
        }

        await tasksRepository.UpdateAliveEndAsync(systemInfo);
    }

}
