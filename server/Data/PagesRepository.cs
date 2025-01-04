using Microsoft.EntityFrameworkCore;
using server.Data.Entities;
using System.Security.Claims;

namespace server.Data;

public class PagesRepository : BaseRepository, IPagesRepository
{

    public PagesRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
    {
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
        try
        {
            await _dbContext.SaveChangesAsync();

        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException != null && ex.InnerException.Message.Contains("uq_page_path"))
            {
                throw new InvalidOperationException($"Page path {page.PagePath} already exists");
            }
            throw;
        }
    }

    public async Task UpdatePageAsync(Page page)
    {
        page.AccountId = accountId;
        Page? existingPage = await GetPageByIdAsync(page.Id);

        if (existingPage == null)
        {
            throw new InvalidOperationException("Page to update not found");
        }

        _dbContext.Entry(existingPage).State = EntityState.Detached;
        _dbContext.Pages.Update(page);
        try
        {
            await _dbContext.SaveChangesAsync();

        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException != null && ex.InnerException.Message.Contains("uq_page_path"))
            {
                throw new InvalidOperationException($"Page path {page.PagePath} already exists");
            }
            throw;
        }
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
