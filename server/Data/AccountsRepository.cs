using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using NuGet.Protocol.Plugins;
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

    public async Task<Account?> GetAccountByEmailAsync(string userEmail)
    {
        string s = userEmail.ToLower();
        Account? account  = await _dbContext.Accounts.FirstOrDefaultAsync(x => x.UserEmail.ToLower() == s);
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
        // initially account.HashedPassword is not hashed 
        string message = PasswordValid(account.HashedPassword);
        if (!String.IsNullOrEmpty(message))
        {
            throw new ArgumentException(message);
        }

        account.Id = 0;
        message = await ValidateNewAccount(account);

        if (!String.IsNullOrEmpty(message))
        {
            throw new ArgumentException(message);
        }

        var parameters = new[]
        {
            new SqlParameter("@salt", SqlDbType.NVarChar) { Direction = ParameterDirection.Output }
        };
        await _dbContext.Database.ExecuteSqlRawAsync("EXEC GenerateSalt @salt OUTPUT", parameters);
        account.Salt = (string)parameters[0].Value;

        account.HashedPassword = await _dbContext.Database
                    .SqlQuery<string>($"SELECT dbo.HashPassword({account.HashedPassword}, {account.Salt})")
                    .FirstAsync();

        _dbContext.Accounts.Add(account);
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

    public async Task<string> ValidateNewAccount(Account account)
    {
        var parameters = new[]
        {
            new SqlParameter("@userName", account.UserName),
            new SqlParameter("@userEmail", account.UserEmail),
            new SqlParameter("@existingAccountId", account.Id > 0 ? account.Id : null),
            new SqlParameter("@message", SqlDbType.VarChar) { Direction = ParameterDirection.Output }
        };
        await _dbContext.Database.ExecuteSqlRawAsync("EXEC ValidateNewAccount @userName, @userEmail, @message OUTPUT", parameters);
        return (string)parameters[3].Value;
    }

    public string PasswordValid(string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            return "Password is required";
        }

        if (password.Length < 8)
        {
            return "The password length must be at least 8 characters";
        }

        return "";
    }

}


