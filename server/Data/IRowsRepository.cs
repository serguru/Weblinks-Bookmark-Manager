using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface IRowsRepository
{
    Task<List<Lrow>> GetAllRowsAsync(int pageId);
    Task<Lrow?> GetRowByIdAsync(int rowId);
    Task AddRowAsync(Lrow row);
    Task UpdateRowAsync(Lrow row);
    Task DeleteRowAsync(int rowId);
}

