using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using server.Data.Entities;

namespace server.Data;

public class AccountsRepository : IAccountsRepository
{
    private readonly Links3dbContext _dbContext;

    public AccountsRepository(Links3dbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Account>> GetAllAccountsAsync()
    {
        List<Account> accounts = await _dbContext.Accounts.ToListAsync();
        return accounts;
    }

    public async Task<Account?> GetAccountByIdAsync(int accountId)
    {
        Account? account = await _dbContext.Accounts.FirstOrDefaultAsync(x => x.Id == accountId);
        return account;
    }

    public async Task<Account> AddAccountAsync(Account account)
    {
        await _dbContext.Accounts.AddAsync(account);
        await _dbContext.SaveChangesAsync();
        return account;
    }

    public async Task<Account> UpdateAccountAsync(Account account)
    {
        _dbContext.Accounts.Update(account);
        await _dbContext.SaveChangesAsync();
        return account;
    }

    public async Task DeleteAccountAsync(int accountId)
    {
        Account? account = await GetAccountByIdAsync(accountId);
        if (account != null)
        {
            _dbContext.Accounts.Remove(account);
            await _dbContext.SaveChangesAsync();
        }
    }




}
