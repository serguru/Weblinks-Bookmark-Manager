using server.Data.Entities;
using server.Data.Models;

namespace server.Services;

public interface IAccountsService
{
    string GenerateToken(Account account);
    Task<Account?> CheckPasswordAsync(LoginModel login);
    Task<Account?> FindAccount(string userName, string userEmail);
    Task<Account?> CreateAccount(LoginModel login);
}
