using server.Data.Entities;
using server.Data.Models;

namespace server.Services;

public interface IAccountsService
{
    string GenerateToken(Account account);
    Task<Account?> CheckPasswordAsync(LoginModel login);
    Task<Account?> GetAccountByEmailAsync(string userEmail);
    Task<AccountModel> GetAccountAsync();
    Task<AccountModel> AddAccountAsync(AccountModel newAccount);
    Task<AccountModel> UpdateAccountAsync(AccountModel account);


}
