using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using server.Common;
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
    Task SaveConfig(StringTransportModel model);
    Task<UserMessageModel> AddUserMessageAsync(UserMessageModel newMessage);
    Task ChangePasswordAsync(ChangePasswordModel model);
    Task DeleteAccountAsync();
    Task AddHistoryEvent(HistoryEventType et, string userEmail, string? comment = null);
}
