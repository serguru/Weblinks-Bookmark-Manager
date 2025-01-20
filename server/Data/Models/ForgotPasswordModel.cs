namespace server.Data.Models;

public class ForgotPasswordModel
{
    public string Email { get; set; } = null!;
    public DateTime UtcTimeIssued { get; set; }
    public int ExpiresInMinutes { get; set; }

}
