using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public class LinksRepository : ILinksRepository
{
    private readonly Links3dbContext _dbContext;

    public LinksRepository(Links3dbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Link>> GetAllLinksAsync(int? columnId = null)
    {
        IQueryable<Link> query = _dbContext.Links.AsQueryable();

        if (columnId.HasValue) 
        {
            query = query
                .Where(c => c.ColumnId == columnId.Value);
        }

        List<Link> links = await query.ToListAsync();
        return links;
    }

    public async Task<Link> AddLinkAsync(Link link)
    {
        await _dbContext.Links.AddAsync(link);
        await _dbContext.SaveChangesAsync();
        return link;
    }

    public async Task<Link> UpdateLinkAsync(Link link)
    {
        _dbContext.Links.Update(link);
        await _dbContext.SaveChangesAsync();
        return link;
    }

    public async Task<Link?> GetLinkByIdAsync(int linkId)
    {
        Link? link = await _dbContext.Links.FirstOrDefaultAsync(x => x.Id == linkId);
        return link;
    }

    public async Task DeleteLinkAsync(int linkId)
    {
        Link? link = await GetLinkByIdAsync(linkId);
        if (link != null)
        {
            _dbContext.Links.Remove(link);
            await _dbContext.SaveChangesAsync();
        }
    }
}
