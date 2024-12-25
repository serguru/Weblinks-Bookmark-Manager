using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public class PagesRepository : IPagesRepository
{
    private readonly Links3dbContext _dbContext;

    public PagesRepository(Links3dbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Page>> GetAllPagesAsync(int? accountId = null)
    {
        IQueryable<Page> query = _dbContext.Pages.AsQueryable()
                .Include(x => x.Lrows)
                .ThenInclude(x => x.Lcolumns)
                .ThenInclude(x => x.Links);

        if (accountId.HasValue) 
        {
            query = query
                .Where(c => c.AccountId == accountId.Value);
        }

        List<Page> pages = await query.ToListAsync();
        return pages;
    }

    public async Task<Page> AddPageAsync(Page page)
    {
        await _dbContext.Pages.AddAsync(page);
        await _dbContext.SaveChangesAsync();
        return page;
    }

    public async Task<Page> UpdatePageAsync(Page page)
    {
        _dbContext.Pages.Update(page);
        await _dbContext.SaveChangesAsync();
        return page;
    }

    public async Task<Page?> GetPageByIdAsync(int pageId)
    {
        Page? page = await _dbContext.Pages.FirstOrDefaultAsync(x => x.Id == pageId);
        return page;
    }

    public async Task DeletePageAsync(int pageId)
    {
        Page? page = await GetPageByIdAsync(pageId);
        if (page != null)
        {
            _dbContext.Pages.Remove(page);
            await _dbContext.SaveChangesAsync();
        }
    }


}
