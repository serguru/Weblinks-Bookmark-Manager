using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public class ColumnsRepository : IColumnsRepository
{
    private readonly Links3dbContext _dbContext;

    public ColumnsRepository(Links3dbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Lcolumn>> GetAllColumnsAsync(int? rowId = null)
    {
        IQueryable<Lcolumn> query = _dbContext.Lcolumns.AsQueryable();

        if (rowId.HasValue) 
        {
            query = query
                .Where(x => x.RowId == rowId.Value);
        }

        List<Lcolumn> columns = await query.ToListAsync();
        return columns;
    }

    public async Task<Lcolumn> AddColumnAsync(Lcolumn column)
    {
        await _dbContext.Lcolumns.AddAsync(column);
        await _dbContext.SaveChangesAsync();
        return column;
    }

    public async Task<Lcolumn> UpdateColumnAsync(Lcolumn column)
    {
        _dbContext.Lcolumns.Update(column);
        await _dbContext.SaveChangesAsync();
        return column;
    }

    public async Task<Lcolumn?> GetColumnByIdAsync(int columnId)
    {
        Lcolumn? column = await _dbContext.Lcolumns
            .FirstOrDefaultAsync(x => x.Id == columnId);
        return column;
    }

    public async Task DeleteColumnAsync(int columnId)
    {
        Lcolumn? column = await GetColumnByIdAsync(columnId);
        if (column != null)
        {
            _dbContext.Lcolumns.Remove(column);
            await _dbContext.SaveChangesAsync();
        }
    }
}
