using server.Data.Models;

namespace server.Services;

public interface IPagesService
{
    // pages
    Task<List<PageModel>> GetAllPagesAsync();
    Task<PageModel?> GetPageByIdAsync(int pageId);
    Task<PageModel> AddPageAsync(PageModel page);
    Task<PageModel> UpdatePageAsync(PageModel page);
    Task<PageModel> AddOrUpdatePageAsync(PageModel page);
    Task DeletePageAsync(int pageId);

    // rows
    Task<List<LrowModel>> GetAllRowsAsync(int pageId);
    Task<LrowModel?> GetRowByIdAsync(int rowId);
    Task<LrowModel> AddRowAsync(LrowModel row);
    Task<LrowModel> UpdateRowAsync(LrowModel row);
    Task<LrowModel> AddOrUpdateRowAsync(LrowModel row);
    Task DeleteRowAsync(int rowId);

    // columns
    Task<LcolumnModel?> GetColumnByIdAsync(int columnId);
    Task<LcolumnModel> AddColumnAsync(LcolumnModel column);
    Task<LcolumnModel> UpdateColumnAsync(LcolumnModel column);
    Task<LcolumnModel> AddOrUpdateColumnAsync(LcolumnModel column);
    Task DeleteColumnAsync(int columnId);


}
