using Microsoft.IdentityModel.Tokens;
using server.Data.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Services;

public interface ITokenService
{
    string GenerateToken(Account account, int? expirationInMinutes = null);
    void ValidateToken(string token);
    JwtSecurityToken DecodeToken(string token);

    string EncryptString(string inputString);
    string DecryptString(string encryptedString);
}
