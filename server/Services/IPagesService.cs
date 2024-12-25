using server.Data.Models;

namespace server.Services;

public interface IPagesService
{
    Task<List<PageModel>> GetAllPagesAsync(int? accountId = null);
    Task<PageModel?> GetPageByIdAsync(int pageId);
    Task AddPageAsync(PageModel page);
    Task UpdatePageAsync(PageModel page);
    Task DeletePageAsync(int pageId);
}
