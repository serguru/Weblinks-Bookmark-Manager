using Microsoft.EntityFrameworkCore;
using server.Data.Entities;
using System.Security.Claims;

namespace server.Data;

public class PagesRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor) : IPagesRepository
{
    private readonly Links3dbContext _dbContext = dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    private int accountId 
    {
        get
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.PrimarySid));
        }
    }

    public async Task<List<Page>> GetAllPagesAsync()
    {
        IQueryable<Page> query = _dbContext.Pages.AsQueryable()
                .Include(x => x.Lrows)
                .ThenInclude(x => x.Lcolumns)
                .ThenInclude(x => x.Links)
                .Where(c => c.AccountId == accountId);

        List<Page> pages = await query.ToListAsync();
        return pages;
    }

    public async Task AddPageAsync(Page page)
    {
        page.AccountId = accountId;
        await _dbContext.Pages.AddAsync(page);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdatePageAsync(Page page)
    {
        Page? existingPage = await GetPageByIdAsync(page.Id);

        if (existingPage == null)
        {
            throw new InvalidOperationException("Page to update not found");
        }

        _dbContext.Pages.Update(page);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Page?> GetPageByIdAsync(int pageId)
    {
        Page? page = await _dbContext.Pages.FirstOrDefaultAsync(x => x.Id == pageId && x.AccountId == accountId);
        return page;
    }

    public async Task DeletePageAsync(int pageId)
    {
        Page? page = await GetPageByIdAsync(pageId);
        if (page == null)
        {
            throw new InvalidOperationException("Page to delete not found");
        }
        _dbContext.Pages.Remove(page);
        await _dbContext.SaveChangesAsync();
    }


}
