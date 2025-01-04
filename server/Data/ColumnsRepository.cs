using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Identity.Client;
using server.Data.Entities;

namespace server.Data;

public class ColumnsRepository : BaseRepository, IColumnsRepository
{

    public ColumnsRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor)
            : base(dbContext, httpContextAccessor)
    {
    }

    public async Task<Lcolumn?> GetColumnByIdAsync(int columnId)
    {
        Lcolumn? column = await _dbContext.Lcolumns
            .Include(x => x.Row)
            .ThenInclude(x => x.Page)
            .Where(x => x.Row.Page.AccountId == accountId)
            .FirstOrDefaultAsync(x => x.Id == columnId);
        return column;
    }

    public async Task AddColumnAsync(Lcolumn column)
    {
        Lrow? row = await _dbContext.Lrows
            .Include(x => x.Page)
            .Where(x => x.Page.AccountId == accountId)
            .FirstOrDefaultAsync(x => x.Id == column.RowId);

        if (row == null)
        {
            throw new InvalidOperationException("Row not found");
        }

        await _dbContext.Lcolumns.AddAsync(column);
        await _dbContext.SaveChangesAsync();
    }

    private async Task<Lcolumn> CheckColumnAccountAsync(int columnId)
    {
        Lcolumn? column = await GetColumnByIdAsync(columnId);

        if (column == null)
        {
            throw new InvalidOperationException("Column not found");
        }

        return column;
    }

    public async Task UpdateColumnAsync(Lcolumn column)
    {
        Lcolumn existingColumn = await CheckColumnAccountAsync(column.Id);
        _dbContext.Entry(existingColumn).State = EntityState.Detached;

        _dbContext.Lcolumns.Update(column);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteColumnAsync(int columnId)
    {
        Lcolumn existingColumn = await CheckColumnAccountAsync(columnId);
        _dbContext.Lcolumns.Remove(existingColumn);
        await _dbContext.SaveChangesAsync();
    }
}
