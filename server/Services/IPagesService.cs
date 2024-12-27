﻿using server.Data.Models;

namespace server.Services;

public interface IPagesService
{
    Task<List<PageModel>> GetAllPagesAsync();
    Task<PageModel?> GetPageByIdAsync(int pageId);
    Task<PageModel> AddPageAsync(PageModel page);
    Task<PageModel> UpdatePageAsync(PageModel page);
    Task DeletePageAsync(int pageId);
}
