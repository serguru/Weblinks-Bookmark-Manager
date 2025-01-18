
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using Microsoft.Extensions.Options;
using MimeKit;
using server.Common;
using System.Text.RegularExpressions;

namespace server.Services;

public class EmailService(IOptions<MailKitSettings> mailKitSettings) : IEmailService
{
    private readonly MailKitSettings _mailKitSettings = mailKitSettings.Value;

    public string PrepareTemplateForSending(List<KeyValuePair<string, string>> fields, string template)
    {
        string result = template;
        fields.ForEach(field =>
        {
            string pattern = "{{" + field.Key + "}}";
            result = Regex.Replace(result, pattern, field.Value);
        });
        return result;
    }

    public async Task SendEmailAsync(string toName, string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Admin", "admin@weblinks.click"));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };
        using var client = new SmtpClient();
        await client.ConnectAsync(_mailKitSettings.SmtpServer, _mailKitSettings.SmtpPort, 
            SecureSocketOptions.SslOnConnect);
        await client.AuthenticateAsync(_mailKitSettings.SmtpUsername, _mailKitSettings.SmtpPassword);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
