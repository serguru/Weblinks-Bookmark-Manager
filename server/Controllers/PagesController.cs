using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public PagesController(IPagesService pagesService)
    {
        _pagesService = pagesService;
    }

    #region Pages

    [HttpGet]
    public async Task<ActionResult<List<PageModel>>> GetAllPagesAsync()
    {
        List<PageModel> pages = await _pagesService.GetAllPagesAsync();
        return Ok(pages);
    }

    [HttpPost("add-update-page")]
    public async Task<IActionResult> AddOrUpdatePage([FromBody] PageModel model)
    {
        try
        {
            PageModel result = await _pagesService.AddOrUpdatePageAsync(model);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("delete-page/{pageId}")]
    public async Task<IActionResult> DeletePage(int pageId)
    {
        await _pagesService.DeletePageAsync(pageId);
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

}
