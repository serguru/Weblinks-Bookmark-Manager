using server.Data.Models;

namespace server.Services;

public interface IPagesService
{
    Task<bool> CheckDbAlive();


    // pages
    Task<List<PageModel>> GetAllPagesAsync();
    Task<PageModel?> GetPageByIdAsync(int pageId);
    Task<PageModel> AddPageAsync(PageModel page);
    Task<PageModel> UpdatePageAsync(PageModel page);
    Task<PageModel> AddOrUpdatePageAsync(PageModel page);
    Task DeletePageAsync(int pageId);

    Task UpdatePageReadOnlyAsync(PageReadOnlyModel model);

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
    Task ColumnMoveAsync(ColumnMoveModel model);


    // links
    Task<LinkModel?> GetLinkByIdAsync(int linkId);
    Task<LinkModel> AddLinkAsync(LinkModel link);
    Task<LinkModel> UpdateLinkAsync(LinkModel link);
    Task<LinkModel> AddOrUpdateLinkAsync(LinkModel link);
    Task DeleteLinkAsync(int linkId);
    Task LinkMoveAsync(LinkMoveModel model);


}
