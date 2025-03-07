﻿using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Mono.TextTemplating;
using server.Common;
using server.Data.Entities;
using server.Data.Models;
using System.Data;
using System.Security.Principal;
using System.Text.Json;

namespace server.Data;

public class AccountsRepository : BaseRepository, IAccountsRepository
{
    public AccountsRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
    {
    }

    public async Task<Account?> GetAccountByEmailAsync(string userEmail)
    {
        string s = userEmail.ToLower();
        Account? account = await _dbContext.Accounts.FirstOrDefaultAsync(x => x.UserEmail.ToLower() == s);
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


    public async Task<string> HashPasswordAsync(string password, string salt)
    {
        var parameters = new[]
        {
            new SqlParameter("@password", password),
            new SqlParameter("@salt", salt),
            new SqlParameter("@hashedPassword", SqlDbType.NVarChar, 8000) { Direction = ParameterDirection.Output }
        };
        await _dbContext.Database.ExecuteSqlRawAsync("exec HashPassword @password, @salt, @hashedPassword output", parameters);

        return (string)parameters[2].Value;
    }

    public async Task AddAccountAsync(Account account)
    {
        // while creating account a password passed in settings
        string message = PasswordValid(account.Settings);
        if (!String.IsNullOrEmpty(message))
        {
            throw new ArgumentException(message);
        }

        account.Id = 0;
        message = await ValidateNewAccountAsync(account);

        if (!String.IsNullOrEmpty(message))
        {
            throw new ArgumentException(message);
        }

        var parameters = new[]
        {
            new SqlParameter("@salt", SqlDbType.NVarChar, 24) { Direction = ParameterDirection.Output }
        };
        await _dbContext.Database.ExecuteSqlRawAsync("exec GenerateSalt @salt output", parameters);
        account.Salt = (string)parameters[0].Value;

        account.HashedPassword = await HashPasswordAsync(account.Settings, account.Salt);
        account.Settings = String.Empty;

        _dbContext.Accounts.Add(account);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateLoggedAccountAsync(Account account)
    {
        if (account.Id != accountId)
        {
            throw new ArgumentException("Account not found");
        }
        await UpdateAccountAsync(account);
    }

    public async Task UpdateAccountAsync(Account account)
    {
        _dbContext.Accounts.Update(account);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAccountAsync()
    {
        Account? account = await GetAccountAsync();
        if (account == null)
        {
            throw new ArgumentException("Account not found");
        }
        _dbContext.Accounts.Remove(account);
        await _dbContext.SaveChangesAsync();
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
                "EXEC VerifyPassword @providedPassword, @storedHash, @salt, @isValid OUTPUT",
                parameters);

        return (bool)parameters[3].Value;
    }

    public async Task<string> ValidateNewAccountAsync(Account account)
    {
        var parameters = new[]
        {
            new SqlParameter("@userName", account.UserName),
            new SqlParameter("@userEmail", account.UserEmail),
            new SqlParameter("@existingAccountId", account.Id),
            new SqlParameter("@message", SqlDbType.VarChar, 1000) { Direction = ParameterDirection.Output }
        };
        await _dbContext.Database.ExecuteSqlRawAsync("EXEC ValidateNewAccount @userName, @userEmail, @existingAccountId, @message OUTPUT", parameters);

        return (string)parameters[3].Value;
    }

    public string PasswordValid(string? password)
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

    public async Task<Account?> GetAccountAsync()
    {
        Account? account = await _dbContext.Accounts
            .Include(x => x.Pages)
            .ThenInclude(x => x.Lrows)
            .ThenInclude(x => x.Lcolumns)
            .ThenInclude(x => x.Links)
            .FirstOrDefaultAsync(x => x.Id == accountId);

        return account;
    }

    public async Task<Account?> GetAccountHavingColumnsAsync()
    {
        var account = await GetAccountAsync();

        if (account == null)
        {
            return null;
        }

        account.Pages = account.Pages
            .Where(p => p.Lrows.Any(c => c.Lcolumns.Any()))
            .ToList();

        return account;
    }

    public async Task AddUserMessageAsync(UserMessage message)
    {
        message.Id = 0;
        message.AccountId = accountId;
        _dbContext.UserMessages.Add(message);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AddHistoryEvent(History e)
    {
        _dbContext.Histories.Add(e);
        await _dbContext.SaveChangesAsync();
    }

}


