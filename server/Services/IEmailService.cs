namespace server.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toName, string toEmail, string subject, string body);
}
