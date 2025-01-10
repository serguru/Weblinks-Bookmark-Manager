using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using NuGet.Configuration;
using NuGet.Packaging;
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
    private readonly IConfiguration _configuration;
    private readonly IAccountsRepository _accountsRepository;
    private readonly IMapper _mapper;

    public AccountsService(IConfiguration configuration, IAccountsRepository accountsRepository, IMapper mapper)
    {
        _configuration = configuration;
        _accountsRepository = accountsRepository;
        _mapper = mapper;
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

    public string GenerateToken(Account account)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("id", account.Id.ToString()),
            new Claim("userName", account.UserName),
            new Claim("userEmail", account.UserEmail),
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpirationInMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<AccountModel> AddAccountAsync(AccountModel newAccount)
    {
        Account account = _mapper.Map<Account>(newAccount);
        await _accountsRepository.AddAccountAsync(account);
        AccountModel result = _mapper.Map<AccountModel>(account);
        return result;
    }


    //private static void ProcessPageModel(PageModel page, SettingsPageModel settings)
    //{
    //    if (settings?.Lrows?.Count == 0 || page?.Lrows?.Count == 0)
    //    {
    //        return;
    //    }

    //    List<LrowModel> rawRows = page.Lrows;

    //    page.Lrows = new List<LrowModel>();


    //    foreach (var settingsRow in settings!.Lrows!)
    //    {
    //        LrowModel? row = rawRows.FirstOrDefault(x => x.Id == settingsRow.Id);

    //        if (row != null)
    //        {
    //            //ProcessRow(row, settingsRow);
    //            page.Lrows.Add(row);
    //            rawRows.Remove(row);
    //        }
    //    }

    //    page.Lrows.AddRange(rawRows);
    //}


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


    public async Task<AccountModel> GetAccountAsync()
    {
        Account? account = await _accountsRepository.GetAccountAsync();
        if (account == null)
        {
            throw new InvalidOperationException("Account does not exists");
        }


        AccountModel result = _mapper.Map<AccountModel>(account);

        ApplySettings(result);

        return result;
    }

    public Task<AccountModel> UpdateAccountAsync(AccountModel account)
    {
        throw new NotImplementedException();
    }

    public async Task SaveConfig(StringTransportModel model)
    {
        Account? account = await _accountsRepository.GetAccountAsync() ?? throw new InvalidOperationException("Account does not exists");
        account.Settings = model.Value;
        await _accountsRepository.UpdateAccountAsync(account);
    }

    public async Task<UserMessageModel> AddUserMessageAsync(UserMessageModel newMessage)
    {
        UserMessage message = _mapper.Map<UserMessage>(newMessage);
        await _accountsRepository.AddUserMessageAsync(message);
        UserMessageModel result = _mapper.Map<UserMessageModel>(message);
        return result;
    }
}