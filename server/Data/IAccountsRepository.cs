using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using server.Data.Entities;
using server.Data.Models;

namespace server.Data;

public interface IAccountsRepository
{
    Task<List<Account>> GetAllAccountsAsync();
    Task<Account?> GetAccountByIdAsync(int accountId);
    Task<Account?> GetAccountByEmailAsync(string userEmail);
    Task AddAccountAsync(Account account);
    Task UpdateAccountAsync(Account account);
    Task DeleteAccountAsync(int accountId);

    Task<bool> VerifyPasswordAsync(string providedPassword, string hashedStoredPassword, string salt);
    Task<string> ValidateNewAccount(Account account);
}
