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

}
