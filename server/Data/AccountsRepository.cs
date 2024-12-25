using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using server.Data.Entities;
using server.Data.Models;
using System.Data;

namespace server.Data;

public class AccountsRepository : IAccountsRepository
{
    private readonly Links3dbContext _dbContext;

    public AccountsRepository(Links3dbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Account?> GetAccountByNameOrEmailAsync(string? userName, string? userEmail)
    {
        Account? account = null;
        string s;
        if (userName != null)
        {
            s = userName.ToLower();
            account = await _dbContext.Accounts.FirstOrDefaultAsync(x => x.UserName != null && x.UserName.ToLower() == s);
        } else if (userEmail != null)
        {
            s = userEmail.ToLower();
            account = await _dbContext.Accounts.FirstOrDefaultAsync(x => x.UserEmail != null && x.UserEmail.ToLower() == s);
        }

        return account;
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

    public async Task AddAccountAsync(Account account)
    {
        await _dbContext.Accounts.AddAsync(account);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateAccountAsync(Account account)
    {
        _dbContext.Accounts.Update(account);
        await _dbContext.SaveChangesAsync();
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

    public async Task<bool> VerifyPasswordAsync(string providedPassword, string hashedStoredPassword, string salt)
    {
        var parameters = new[]
               {
            new SqlParameter("@providedPassword", providedPassword),
            new SqlParameter("@storedHash", hashedStoredPassword),
            new SqlParameter("@salt", salt),
            new SqlParameter("@isValid", SqlDbType.Bit) { Direction = ParameterDirection.Output }
        };

        await _dbContext.Database
            .ExecuteSqlRawAsync(
                "EXEC dbo.VerifyPassword @providedPassword, @storedHash, @salt, @isValid OUTPUT",
                parameters);

        return (bool)parameters[3].Value;
    }

    public async Task<Account?> CreateAccount(LoginModel login)
    {
        var parameters = new[]
        {
            new SqlParameter("@salt", SqlDbType.NVarChar) { Direction = ParameterDirection.Output }
        };
        await _dbContext.Database.ExecuteSqlRawAsync("EXEC GenerateSalt @salt OUTPUT", parameters);

        string salt = (string)parameters[0].Value;

        string hash = await _dbContext.Database
                    .SqlQuery<string>($"SELECT dbo.HashPassword({login.UserPassword}, {salt})")
                    .FirstAsync();

        Account account = new Account
        {
            UserName = login.UserName,
            UserEmail = login.UserEmail,
            HashedPassword = hash,
            Salt = salt
        };

        _dbContext.Accounts.Add(account);
        await _dbContext.SaveChangesAsync();
        return account;
    }
}


