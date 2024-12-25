using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface ILinksRepository
{
    Task<List<Link>> GetAllLinksAsync(int? rowId = null);
    Task<Link?> GetLinkByIdAsync(int linkId);
    Task<Link> AddLinkAsync(Link link);
    Task<Link> UpdateLinkAsync(Link link);
    Task DeleteLinkAsync(int link);
}

