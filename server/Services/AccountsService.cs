using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using Newtonsoft.Json.Linq;
using NuGet.Configuration;
using NuGet.Packaging;
using server.Common;
using server.Data;
using server.Data.Entities;
using server.Data.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Text.Json;

namespace server.Services;

public class AccountsService : IAccountsService
{
    protected readonly Links3dbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly IAccountsRepository _accountsRepository;
    private readonly IMapper _mapper;
    private readonly ITasksRepository _tasksRepository;
    private readonly ITokenService _tokenService;


    public AccountsService(Links3dbContext dbContext, IConfiguration configuration,
        IAccountsRepository accountsRepository,
        ITasksRepository tasksRepository,
        IMapper mapper,
        ITokenService tokenService
        )
    {
        _configuration = configuration;
        _accountsRepository = accountsRepository;
        _mapper = mapper;
        _dbContext = dbContext;
        _tasksRepository = tasksRepository;
        _tokenService = tokenService;
    }

    public async Task<Account?> GetAccountByEmailAsync(string userEmail)
    {
        Account? account = await _accountsRepository.GetAccountByEmailAsync(userEmail);
        return account;
    }

    public async Task<Account?> CheckPasswordAsync(LoginModel login)
    {
        Account? account = await GetAccountByEmailAsync(login.UserEmail);
        if (account == null)
        {
            return null;
        }
        bool validPassword = await _accountsRepository.VerifyPasswordAsync(login.UserPassword, account.HashedPassword, account.Salt);
        if (!validPassword)
        {
            return null;
        }
        return account;
    }


    public async Task<AccountModel> AddAccountAsync(AccountModel newAccount)
    {
        Account account = _mapper.Map<Account>(newAccount);
        await _accountsRepository.AddAccountAsync(account);
        AccountModel result = _mapper.Map<AccountModel>(account);
        return result;
    }

    private static void ProcessColumnModel(LcolumnModel column, SettingsColumnModel settings)
    {

        ICollection<LinkModel> rawLinks = column.Links;

        column.Links = new List<LinkModel>();


        foreach (var settingsLink in settings!.Links!)
        {
            LinkModel? link = rawLinks.FirstOrDefault(x => x.Id == settingsLink.Id);

            if (link != null)
            {
                column.Links.Add(link);
                rawLinks.Remove(link);
            }
        }

        column.Links.AddRange(rawLinks);
    }

    private static void ProcessRowModel(LrowModel row, SettingsRowModel settings)
    {

        ICollection<LcolumnModel> rawColumns = row.Lcolumns;

        row.Lcolumns = new List<LcolumnModel>();


        foreach (var settingsColumn in settings!.Lcolumns!)
        {
            LcolumnModel? column = rawColumns.FirstOrDefault(x => x.Id == settingsColumn.Id);

            if (column != null)
            {
                if (column.Links != null && column.Links.Count > 0 &&
                    settingsColumn.Links != null && settingsColumn.Links.Count > 0)
                {
                    ProcessColumnModel(column, settingsColumn);
                }
                row.Lcolumns.Add(column);
                rawColumns.Remove(column);
            }
        }

        row.Lcolumns.AddRange(rawColumns);
    }

    private static void ProcessPageModel(PageModel page, SettingsPageModel settings)
    {

        ICollection<LrowModel> rawRows = page.Lrows;

        page.Lrows = new List<LrowModel>();


        foreach (var settingsRow in settings!.Lrows!)
        {
            LrowModel? row = rawRows.FirstOrDefault(x => x.Id == settingsRow.Id);

            if (row != null)
            {
                if (row.Lcolumns != null && row.Lcolumns.Count > 0 &&
                    settingsRow.Lcolumns != null && settingsRow.Lcolumns.Count > 0)
                {
                    ProcessRowModel(row, settingsRow);
                }
                page.Lrows.Add(row);
                rawRows.Remove(row);
            }
        }

        page.Lrows.AddRange(rawRows);
    }

    private static void ProcessAccountModel(AccountModel account, SettingsModel settings)
    {

        ICollection<PageModel> rawPages = account.Pages;

        account.Pages = new List<PageModel>();


        foreach (var settingsPage in settings!.Pages!)
        {
            PageModel? page = rawPages.FirstOrDefault(x => x.Id == settingsPage.Id);

            if (page != null)
            {
                if (page.Lrows != null && page.Lrows.Count > 0 &&
                    settingsPage.Lrows != null && settingsPage.Lrows.Count > 0)
                {
                    ProcessPageModel(page, settingsPage);
                }
                account.Pages.Add(page);
                rawPages.Remove(page);
            }
        }

        account.Pages.AddRange(rawPages);
    }

    private static void ApplySettings(AccountModel accountModel)
    {

        if (accountModel == null || accountModel.Pages == null || accountModel.Pages.Count == 0)
        {
            return;
        }

        if (string.IsNullOrEmpty(accountModel.Settings))
        {
            return;
        }

        SettingsModel? settingsModel = JsonSerializer.Deserialize<SettingsModel>(accountModel.Settings);

        if (settingsModel == null || settingsModel.Pages == null || settingsModel.Pages.Count == 0)
        {
            return;
        }


        if (accountModel.Id != settingsModel.Id)
        {
            throw new InvalidOperationException("Wrong account id in settings");
        }

        ProcessAccountModel(accountModel, settingsModel);

    }

    public async Task<AccountModel?> GetAccountAsync()
    {
        Account? account = await _accountsRepository.GetAccountAsync();
        if (account == null)
        {
            // throw new InvalidOperationException("Account does not exists");
            return null;
        }
        AccountModel result = _mapper.Map<AccountModel>(account);
        ApplySettings(result);
        return result;
    }

    public async Task<AccountModel> UpdateAccountAsync(AccountModel accountModel)
    {
        Account? account = await _accountsRepository.GetAccountAsync() ?? throw new InvalidOperationException("Account does not exists");

        account.FirstName = accountModel.FirstName;
        account.LastName = accountModel.LastName;
        account.UserName = accountModel.UserName;
        account.UserEmail = accountModel.UserEmail;

        await _accountsRepository.UpdateLoggedAccountAsync(account);
        AccountModel result = _mapper.Map<AccountModel>(account);
        return result;
    }

    public async Task SaveConfig(StringTransportModel model)
    {
        Account? account = await _accountsRepository.GetAccountAsync() ?? throw new InvalidOperationException("Account does not exists");
        account.Settings = model.Value;
        await _accountsRepository.UpdateLoggedAccountAsync(account);
    }

    public async Task<UserMessageModel> AddUserMessageAsync(UserMessageModel newMessage)
    {
        UserMessage message = _mapper.Map<UserMessage>(newMessage);
        await _accountsRepository.AddUserMessageAsync(message);
        UserMessageModel result = _mapper.Map<UserMessageModel>(message);
        return result;
    }

    public async Task ChangePasswordAsync(ChangePasswordModel model)
    {
        Account? account = await _accountsRepository.GetAccountAsync() ?? throw new InvalidOperationException("Account does not exists");

        LoginModel lm = new LoginModel { UserEmail = account.UserEmail, UserPassword = model.OldPassword };

        Account? verifiedAccount = await CheckPasswordAsync(lm);
        if (verifiedAccount == null)
        {
            throw new UnauthorizedAccessException("Invalid old password");
        }

        account.HashedPassword = await _accountsRepository.HashPasswordAsync(model.Password, account.Salt);
        await _accountsRepository.UpdateLoggedAccountAsync(account);
    }

    public async Task DeleteAccountAsync()
    {
        await _accountsRepository.DeleteAccountAsync();
    }

    public async Task<History> AddHistoryEvent(HistoryEventType et, string userEmail, string? comment = null)
    {
        var history = new History()
        {
            Id = 0,
            EventTypeId = (int)et,
            UserEmail = userEmail,
            Comment = comment
        };
        await _accountsRepository.AddHistoryEvent(history);
        return history;
    }

    public async Task<AccountModel> RegisterAccountAsync(AccountModel accountModel)
    {
        return await _dbContext.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            using var transaction = _dbContext.Database.BeginTransaction();

            try
            {
                AccountModel result = await AddAccountAsync(accountModel);
                History history = await AddHistoryEvent(HistoryEventType.User_registered, accountModel.UserEmail);
                OperTask operTask = new()
                {
                    Id = 0,
                    HistoryId = history.Id,
                    TaskTypeId = (int)WeblinksTaskType.Send_register_email
                };
                await _tasksRepository.AddOperTaskAsync(operTask);
                transaction.Commit();
                return result;

            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw;
            }
        });
    }

    public async Task ForgotPasswordAsync(string userEmail)
    {
        await _dbContext.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            using var transaction = _dbContext.Database.BeginTransaction();
            try
            {
                Account? account = await _accountsRepository.GetAccountByEmailAsync(userEmail) ?? throw new InvalidOperationException("Account does not exists");

                History history = await AddHistoryEvent(HistoryEventType.User_forgot_password, userEmail);
                OperTask operTask = new()
                {
                    Id = 0,
                    HistoryId = history.Id,
                    TaskTypeId = (int)WeblinksTaskType.Send_forgot_email
                };
                await _tasksRepository.AddOperTaskAsync(operTask);
                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw;
            }
        });


    }

    public async Task<string?> ResetPasswordAsync(ResetPasswordModel model)
    {
        string? message = _tokenService.ValidateToken(model.Token);
        if (message != null)
        {
            return message;
        }

        JwtSecurityToken decoded = _tokenService.DecodeToken(model.Token);

        string? email = decoded.Claims.FirstOrDefault(x => x.Type == "userEmail")?.Value;

        if (email == null)
        {
            return "Email not found in the token";
        }

        Account? account = await _accountsRepository.GetAccountByEmailAsync(email);
        if (account == null)
        {
            return "Account not found";
        }

        account.HashedPassword = await _accountsRepository.HashPasswordAsync(model.NewPassword, account.Salt);
        await _accountsRepository.UpdateAccountAsync(account);

        return null;
    }
}