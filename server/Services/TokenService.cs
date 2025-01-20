using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using server.Data.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace server.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    private readonly IConfiguration _configuration = configuration;

    private static byte[] salt = new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 };

    public string GenerateToken(Account account, int? expirationInMinutes = null)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("id", account.Id.ToString()),
            new Claim("userName", account.UserName),
            new Claim("userEmail", account.UserEmail),
        };

        var expiration = expirationInMinutes ?? Convert.ToDouble(_configuration["JwtSettings:ExpirationInMinutes"]);

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(expiration),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = securityKey,
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return null;
        }
        catch (SecurityTokenExpiredException e)
        {
            return "Token expired";
        }
        catch
        {
            return "Token invalid";
        }
    }

    public JwtSecurityToken DecodeToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.ReadToken(token) as JwtSecurityToken;
    }

    public string EncryptString(string inputString)
    {
        // Create a new AES object
        using (Aes aes = Aes.Create())
        {
            // Set the secret key and salt
            var deriveBytes = new Rfc2898DeriveBytes(_configuration["JwtSettings:SecretKey"], salt, 1000);
            aes.Key = deriveBytes.GetBytes(32);
            aes.IV = deriveBytes.GetBytes(16);

            // Create a new encryptor object
            ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

            // Encrypt the input string
            byte[] bytes = Encoding.UTF8.GetBytes(inputString);
            byte[] encryptedBytes = encryptor.TransformFinalBlock(bytes, 0, bytes.Length);

            // Base64 encode the encrypted bytes
            string encodedString = Convert.ToBase64String(encryptedBytes);

            // URL encode the Base64 encoded string
            //string encryptedString = WebUtility.UrlEncode(encodedString);

            return encodedString;
        }
    }

    public string DecryptString(string encryptedString)
    {
        // URL decode the encrypted string
        //string decodedString = HttpUtility.UrlDecode(encryptedString);

        // Base64 decode the URL decoded string
        byte[] encryptedBytes = Convert.FromBase64String(encryptedString);

        // Create a new AES object
        using (Aes aes = Aes.Create())
        {
            // Set the secret key and salt
            Rfc2898DeriveBytes deriveBytes = new Rfc2898DeriveBytes(_configuration["JwtSettings:SecretKey"], salt, 1000);
            aes.Key = deriveBytes.GetBytes(32);
            aes.IV = deriveBytes.GetBytes(16);

            // Create a new decryptor object
            ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            // Decrypt the encrypted bytes
            byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);

            // Convert the decrypted bytes to a string
            string decryptedString = Encoding.UTF8.GetString(decryptedBytes);

            return decryptedString;
        }
    }
}
