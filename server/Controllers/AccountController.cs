using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Data.Entities;
using server.Data.Models;
using server.Services;
using server.Common;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AccountController(IAccountsService accountsService, ITokenService tokenService) : ControllerBase
{
    private IAccountsService _accountsService = accountsService;
    private ITokenService _tokenService = tokenService;

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] AccountModel model)
    {
        AccountModel result = await _accountsService.RegisterAccountAsync(model);
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
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        Account? account = await _accountsService.CheckPasswordAsync(model);

        if (account == null)
        {
            return Unauthorized();
        }
        string token = _tokenService.GenerateToken(account);
        await _accountsService.AddHistoryEvent(HistoryEventType.User_logged_in, model.UserEmail);

        return Ok(new { token });
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
        var account = await _accountsService.GetAccountAsync();
        if (account == null)
        {
            return Unauthorized();
        }

        await _accountsService.AddHistoryEvent(HistoryEventType.User_deleted_the_account,
            account.UserEmail);

        await _accountsService.DeleteAccountAsync();

        return Ok();
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] LoginModel model)
    {

        Account? account = await _accountsService.GetAccountByEmailAsync(model.UserEmail);

        if (account == null)
        {
            return NotFound("Account with this email was not found");
        }

        await _accountsService.ForgotPasswordAsync(model.UserEmail);
        return Ok();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
    {
        string? result = await _accountsService.ResetPasswordAsync(model);
        if (result != null) 
        { 
            return BadRequest(result);
        }
        return Ok();
    }
}
