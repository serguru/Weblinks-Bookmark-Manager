
using server.Data.Entities;

namespace server.Data
{
    public interface IPagesRepository
    {
        Task<List<PageEntity>> GetAllPagesAsync(int? accountId = null);
    }
}
