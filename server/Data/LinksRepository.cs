using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using server.Data.Entities;

namespace server.Data;

public class LinksRepository : BaseRepository, ILinksRepository
{
    public LinksRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
    {
    }

    public async Task<Link?> GetLinkByIdAsync(int linkId)
    {
        Link? link = await _dbContext.Links
            .Include(x => x.Column)
            .ThenInclude(x => x.Row)
            .ThenInclude(x => x.Page)
            .Where(x => x.Column.Row.Page.AccountId == accountId)
            .FirstOrDefaultAsync(x => x.Id == linkId);
        return link;
    }

    public async Task AddLinkAsync(Link link)
    {
        Lcolumn? column = await _dbContext.Lcolumns
            .Include(x => x.Row)
            .ThenInclude(x => x.Page)
            .Where(x => x.Row.Page.AccountId == accountId)
            .FirstOrDefaultAsync(x => x.Id == link.ColumnId);

        if (column == null)
        {
            throw new InvalidOperationException("Row not found");
        }

        await _dbContext.Links.AddAsync(link);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<Link> CheckLinkAccountAsync(int linkId)
    {
        Link? link = await GetLinkByIdAsync(linkId);

        if (link == null)
        {
            throw new InvalidOperationException("Link not found");
        }

        return link;
    }


    public async Task UpdateLinkAsync(Link link)
    {
        Link existingLink = await CheckLinkAccountAsync(link.Id);
        _dbContext.Entry(existingLink).State = EntityState.Detached;
        _dbContext.Links.Update(link);
        await _dbContext.SaveChangesAsync();
    }


    public async Task DeleteLinkAsync(int linkId)
    {
        Link existingLink = await CheckLinkAccountAsync(linkId);
        _dbContext.Links.Remove(existingLink);
        await _dbContext.SaveChangesAsync();
    }
}
