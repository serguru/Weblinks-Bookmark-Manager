using server.Data.Models;

namespace server.Services;

public interface IPagesService
{
    Task<List<PageModel>> GetAllPagesAsync(int? accountId = null);
}

