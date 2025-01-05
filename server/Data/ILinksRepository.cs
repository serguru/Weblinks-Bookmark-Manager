using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data;

public interface ILinksRepository
{
    Task<Link?> GetLinkByIdAsync(int linkId);
    Task AddLinkAsync(Link link);
    Task UpdateLinkAsync(Link link);
    Task DeleteLinkAsync(int link);
}

