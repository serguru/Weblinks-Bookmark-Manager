using server.Data.Models;

namespace server.Data
{
    public interface IPagesRepository
    {
        Task<List<PageModel>> GetAllPagesAsync(int? accountId = null);
    }
}
