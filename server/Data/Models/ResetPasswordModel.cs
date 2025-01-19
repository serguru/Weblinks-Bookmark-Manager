namespace server.Data.Models;

public class ResetPasswordModel
{
    public string Token { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
