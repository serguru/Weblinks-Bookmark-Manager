using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface IColumnsRepository
{
    Task<Lcolumn?> GetColumnByIdAsync(int columnId);
    Task AddColumnAsync(Lcolumn column);
    Task UpdateColumnAsync(Lcolumn column);
    Task DeleteColumnAsync(int column);
}

