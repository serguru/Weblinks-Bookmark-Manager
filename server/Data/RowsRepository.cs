using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public class RowsRepository : BaseRepository, IRowsRepository
{

    public RowsRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
    {
    }

    public async Task<List<Lrow>> GetAllRowsAsync(int pageId)
    {
        IQueryable<Lrow> query = 
            _dbContext.Lrows
            .Include(r => r.Page)
            .Where(c => c.PageId == pageId && c.Page.AccountId == accountId);

        List<Lrow> rows = await query.ToListAsync();
     
        return rows;
    }

    public async Task<Lrow?> GetRowByIdAsync(int rowId)
    {
        Lrow? row = await _dbContext.Lrows
            .Include(r => r.Page)
            .Where(c => c.Page.AccountId == accountId)
            .FirstOrDefaultAsync(x => x.Id == rowId);
        return row;
    }

    public async Task AddRowAsync(Lrow row)
    {
        Page? page = await _dbContext.Pages.FirstOrDefaultAsync(x => x.Id == row.PageId && x.AccountId == accountId);
        if (page == null)
        {
            throw new InvalidOperationException("Page not found");
        }
        await _dbContext.Lrows.AddAsync(row);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<Lrow> CheckRowAccountAsync(int rowId)
    {
        Lrow? row = await GetRowByIdAsync(rowId);

        if (row == null)
        {
            throw new InvalidOperationException("Row not found");
        }

        return row;
    }

    public async Task UpdateRowAsync(Lrow row)
    {
        Lrow existingRow = await CheckRowAccountAsync(row.Id);
        _dbContext.Entry(existingRow).State = EntityState.Detached;

        _dbContext.Lrows.Update(row);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteRowAsync(int rowId)
    {
        Lrow existingRow = await CheckRowAccountAsync(rowId);
        _dbContext.Lrows.Remove(existingRow);
        await _dbContext.SaveChangesAsync();
    }


}
