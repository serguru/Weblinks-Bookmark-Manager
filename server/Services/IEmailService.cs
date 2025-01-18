namespace server.Services;

public interface IEmailService
{
    // KeyValue<string, string>
    string PrepareTemplateForSending(List<KeyValuePair<string, string>> fields, string template);
    Task SendEmailAsync(string toName, string toEmail, string subject, string body);
}
