using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data.Entities;
using server.Data.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private IAccountsService _accountsService;

    public AccountController(IAccountsService accountsService)
    {
        _accountsService = accountsService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AccountModel model)
    {
        AccountModel result = await _accountsService.AddAccountAsync(model);
        return Ok(result);
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] AccountModel model)
    {
        AccountModel result = await _accountsService.UpdateAccountAsync(model);
        return Ok(result);
    }

    [HttpPut("change-password")]

    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
    {
        await _accountsService.ChangePasswordAsync(model);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        Account? account = await _accountsService.CheckPasswordAsync(model);

        if (account == null)
        {
            return Unauthorized();
        }
        string token = _accountsService.GenerateToken(account);
        return Ok(new {token});
    }

    [HttpPost("save-config")]
    public async Task<IActionResult> SaveConfig([FromBody] StringTransportModel model)
    {
        await _accountsService.SaveConfig(model);
        return Ok();
    }

    [HttpPost("add-user-message")]
    public async Task<IActionResult> AddUserMessage([FromBody] UserMessageModel model)
    {
        await _accountsService.AddUserMessageAsync(model);
        return Ok(new { model });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteAccount()
    {
        await _accountsService.DeleteAccountAsync();
        return Ok();
    }
}
