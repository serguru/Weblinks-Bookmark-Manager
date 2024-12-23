using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data.Models;
using server.Services;

namespace server.Controllers;

[Route("api/[controller]")]
[ApiController]
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
        var pages = await _pagesService.GetAllPagesAsync();
        return Ok(pages);
    }
}
