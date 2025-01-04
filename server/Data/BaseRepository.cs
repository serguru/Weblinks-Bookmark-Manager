using System.Security.Claims;

namespace server.Data;

public class BaseRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor)
{
    protected readonly Links3dbContext _dbContext = dbContext;
    protected readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    protected int accountId
    {
        get
        {
            return int.Parse(_httpContextAccessor.HttpContext.User.FindFirstValue("id"));
        }
    }
}
