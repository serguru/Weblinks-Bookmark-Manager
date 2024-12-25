namespace server.Data.Models;

public class LoginModel
{
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public string UserPassword { get; set; } = null!;
}
