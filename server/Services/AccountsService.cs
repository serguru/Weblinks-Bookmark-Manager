using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Data.Entities;
using server.Data.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
            new Claim(ClaimTypes.PrimarySid, account.Id.ToString()),
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
}
