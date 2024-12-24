
using server.Data.Entities;

namespace server.Data
{
    public interface IPagesRepository
    {
        Task<List<Page>> GetAllPagesAsync(int? accountId = null);
    }
}
