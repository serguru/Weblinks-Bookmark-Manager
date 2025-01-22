using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using server.Common;
using server.Data.Entities;
using server.Data.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PagesController : ControllerBase
{
    private readonly IPagesService _pagesService;
    private readonly IAccountsService _accountsService;
    public PagesController(IPagesService pagesService, IAccountsService accountsService)
    {
        _pagesService = pagesService;
        _accountsService = accountsService;
    }

    [HttpGet]
    public async Task<ActionResult<AccountModel>> GetAccountAsync()
    {
        AccountModel? account = await _accountsService.GetAccountAsync();
        if (account == null)
        {
            return Unauthorized();
        }
        await _accountsService.AddHistoryEvent(HistoryEventType.User_retrieved_the_account, account.UserEmail);
        return Ok(account);
    }

    [HttpGet("having-columns")]
    public async Task<ActionResult<AccountModel>> GetAccountHavingColumnsAsync()
    {
        AccountModel? account = await _accountsService.GetAccountHavingColumnsAsync();
        if (account == null)
        {
            return Unauthorized();
        }
        await _accountsService.AddHistoryEvent(HistoryEventType.User_retrieved_the_account, account.UserEmail);
        return Ok(account);
    }


    #region Pages

    [HttpGet("all")]
    public async Task<ActionResult<List<PageModel>>> GetAllPagesAsync()
    {
        List<PageModel> pages = await _pagesService.GetAllPagesAsync();
        return Ok(pages);
    }

    [HttpPost("add-update-page")]
    public async Task<IActionResult> AddOrUpdatePage([FromBody] PageModel model)
    {
        PageModel result = await _pagesService.AddOrUpdatePageAsync(model);
        if (model.Id == 0)
        {
            var account = await _accountsService.GetAccountAsync();

            if (account == null)
            {
                return Unauthorized();
            }
            await _accountsService.AddHistoryEvent(HistoryEventType.User_created_a_page, account.UserEmail);
        }
        return Ok(result);
    }

    [HttpDelete("delete-page/{pageId}")]
    public async Task<IActionResult> DeletePage(int pageId)
    {
        await _pagesService.DeletePageAsync(pageId);
        var account = await _accountsService.GetAccountAsync();
        if (account == null)
        {
            return Unauthorized();
        }
        await _accountsService.AddHistoryEvent(HistoryEventType.User_deleted_a_page, account.UserEmail);

        return Ok();
    }
    #endregion

    #region Rows

    [HttpGet("rows/{pageId}")]
    public async Task<ActionResult<List<LrowModel>>> GetAllRowsAsync(int pageId)
    {
        List<LrowModel> rows = await _pagesService.GetAllRowsAsync(pageId);
        return Ok(rows);
    }

    [HttpPost("add-update-row")]
    public async Task<IActionResult> AddOrUpdateRow([FromBody] LrowModel model)
    {
        LrowModel result = await _pagesService.AddOrUpdateRowAsync(model);
        return Ok(result);
    }

    [HttpDelete("delete-row/{rowId}")]
    public async Task<IActionResult> DeleteRow(int rowId)
    {
        await _pagesService.DeleteRowAsync(rowId);
        return Ok();
    }

    #endregion

    #region Columns

    [HttpPost("add-update-column")]
    public async Task<IActionResult> AddOrUpdateColumn([FromBody] LcolumnModel model)
    {
        LcolumnModel result = await _pagesService.AddOrUpdateColumnAsync(model);
        return Ok(result);
    }

    [HttpDelete("delete-column/{columnId}")]
    public async Task<IActionResult> DeleteColumn(int columnId)
    {
        await _pagesService.DeleteColumnAsync(columnId);
        return Ok();
    }

    #endregion

    #region Links

    [HttpPost("add-update-link")]
    public async Task<IActionResult> AddOrUpdateLink([FromBody] LinkModel model)
    {
        LinkModel result = await _pagesService.AddOrUpdateLinkAsync(model);
        return Ok(result);
    }

    [HttpDelete("delete-link/{linkId}")]
    public async Task<IActionResult> DeleteLink(int linkId)
    {
        await _pagesService.DeleteLinkAsync(linkId);
        return Ok();
    }

    #endregion

    [HttpGet("alive")]
    [AllowAnonymous]
    //[DisableCors]
    public async Task<IActionResult> AreYouAlive()
    {
        bool dbAlive = await _pagesService.CheckDbAlive();
        return Ok(new { message = $"API is alive. DB is{(dbAlive ? "" : " not")} alive." });
    }

}
