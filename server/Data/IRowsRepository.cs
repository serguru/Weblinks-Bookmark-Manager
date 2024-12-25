using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface IRowsRepository
{
    Task<List<Lrow>> GetAllRowsAsync(int? pageId = null);
    Task<Lrow?> GetRowByIdAsync(int rowId);
    Task<Lrow> AddRowAsync(Lrow row);
    Task<Lrow> UpdateRowAsync(Lrow row);
    Task DeleteRowAsync(int rowId);
}

