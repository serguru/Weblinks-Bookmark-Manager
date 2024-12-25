using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using server.Data.Entities;

namespace server.Data;

public interface IAccountsRepository
{
    Task<List<Account>> GetAllAccountsAsync();
    Task<Account?> GetAccountByIdAsync(int accountId);
    Task AddAccountAsync(Account account);
    Task UpdateAccountAsync(Account account);
    Task DeleteAccountAsync(int accountId);
}
