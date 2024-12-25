using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public class RowsRepository : IRowsRepository
{
    private readonly Links3dbContext _dbContext;

    public RowsRepository(Links3dbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Lrow>> GetAllRowsAsync(int? pageId = null)
    {
        IQueryable<Lrow> query = _dbContext.Lrows.AsQueryable();

        if (pageId.HasValue) 
        {
            query = query
                .Where(c => c.PageId == pageId.Value);
        }

        List<Lrow> rows = await query.ToListAsync();
        return rows;
    }

    public async Task AddRowAsync(Lrow row)
    {
        await _dbContext.Lrows.AddAsync(row);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateRowAsync(Lrow row)
    {
        _dbContext.Lrows.Update(row);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Lrow?> GetRowByIdAsync(int rowId)
    {
        Lrow? row = await _dbContext.Lrows.FirstOrDefaultAsync(x => x.Id == rowId);
        return row;
    }

    public async Task DeleteRowAsync(int rowId)
    {
        Lrow? row = await GetRowByIdAsync(rowId);
        if (row != null)
        {
            _dbContext.Lrows.Remove(row);
            await _dbContext.SaveChangesAsync();
        }
    }


}
