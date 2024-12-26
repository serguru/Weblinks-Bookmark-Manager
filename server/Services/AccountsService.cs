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

    public AccountsService(IConfiguration configuration, IAccountsRepository accountsRepository)
    {
        _configuration = configuration;
        _accountsRepository = accountsRepository;
    }

    public async Task<Account?> FindAccount(string userEmail)
    {
        Account? account = await _accountsRepository.GetAccountByEmailAsync(userEmail);
        return account;
    }

    public async Task<Account?> CheckPasswordAsync(LoginModel login)
    {
        Account? account = await FindAccount(login.UserEmail);
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
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(ClaimTypes.Email, account.UserEmail),
            new Claim(ClaimTypes.Role, account.IsAdmin ? "admin" : "public")
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




}
