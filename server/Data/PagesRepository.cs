using Microsoft.EntityFrameworkCore;
using server.Data.Entities;
using server.Data.Models;

namespace server.Data;

public class PagesRepository : IPagesRepository
{
    private readonly Links3dbContext dbContext;

    public PagesRepository(Links3dbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<List<Page>> GetAllPagesAsync(int? accountId = null)
    {
        List<Page> pages = await dbContext.Pages.ToListAsync();
        return pages;
    }
}