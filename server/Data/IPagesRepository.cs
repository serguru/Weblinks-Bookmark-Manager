﻿using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface IPagesRepository
{
    Task<List<Page>> GetAllPagesAsync(int? pageId = null);
    Task<Page?> GetPageByIdAsync(int pageId);
    Task AddPageAsync(Page page);
    Task UpdatePageAsync(Page page);
    Task DeletePageAsync(int pageId);
}

