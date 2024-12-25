using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface IColumnsRepository
{
    Task<List<Lcolumn>> GetAllColumnsAsync(int? rowId = null);
    Task<Lcolumn?> GetColumnByIdAsync(int columnId);
    Task<Lcolumn> AddColumnAsync(Lcolumn column);
    Task<Lcolumn> UpdateColumnAsync(Lcolumn column);
    Task DeleteColumnAsync(int column);
}

