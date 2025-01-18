
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using server.Common;

namespace server.Services;

public class EmailService(IOptions<MailKitSettings> mailKitSettings) : IEmailService
{
    private readonly MailKitSettings _mailKitSettings = mailKitSettings.Value;

    public async Task SendEmailAsync(string toName, string toEmail, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Admin", "admin@weblinks.click"));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = subject;
        message.Body = new TextPart("plain") { Text = body };
        using var client = new SmtpClient();
        await client.ConnectAsync(_mailKitSettings.SmtpServer, _mailKitSettings.SmtpPort, 
            SecureSocketOptions.SslOnConnect);
        await client.AuthenticateAsync(_mailKitSettings.SmtpUsername, _mailKitSettings.SmtpPassword);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
