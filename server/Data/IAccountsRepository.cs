using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using server.Data.Entities;
using server.Data.Models;

namespace server.Data;

public interface IAccountsRepository
{
    Task<List<Account>> GetAllAccountsAsync();
    Task<Account?> GetAccountHavingColumnsAsync();
    Task<Account?> GetAccountAsync();
    Task<Account?> GetAccountByIdAsync(int accountId);
    Task<Account?> GetAccountByEmailAsync(string userEmail);
    Task AddAccountAsync(Account account);
    Task UpdateAccountAsync(Account account);
    Task UpdateLoggedAccountAsync(Account account);
    Task<bool> VerifyPasswordAsync(string providedPassword, string hashedStoredPassword, string salt);
    Task<string> ValidateNewAccountAsync(Account account);
    Task AddUserMessageAsync(UserMessage message);
    Task<string> HashPasswordAsync(string password, string salt);
    Task DeleteAccountAsync();
    Task AddHistoryEvent(History e);

}
