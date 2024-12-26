namespace server.Data.Models;

public class LoginModel
{
    public string UserEmail { get; set; }
    public string UserPassword { get; set; } = null!;
}
