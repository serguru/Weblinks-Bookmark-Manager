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

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] AccountModel model)
    {
        AccountModel result = await _accountsService.AddAccountAsync(model);
        return Ok(result);
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
}
