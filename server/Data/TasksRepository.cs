using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Common;
using server.Data.Entities;
using System.Data;
using System.Security.Claims;

namespace server.Data;

public class TasksRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor) : BaseRepository(dbContext, httpContextAccessor), ITasksRepository
{
    public async Task<List<OperTask>> OperTasksAsync(WeblinksTaskType? taskType = null)
    {
        IQueryable<OperTask> query =
            _dbContext.OperTasks
            .Include(x => x.History)
            .AsQueryable();

        if (taskType != null)
        {
            query = query.Where(x => x.TaskTypeId == (int)taskType);
        }

        List<OperTask> result = await query.ToListAsync();
        
        return result;
    }

    public async Task ArchiveOperTask(int operTaskId, string? comment = null)
    {
        var parameters = new[]
        {
            new SqlParameter("@operTaskId", operTaskId),
            new SqlParameter("@comment", comment),
        };
        await _dbContext.Database.ExecuteSqlRawAsync("exec ArchiveOperTask @operTaskId, @comment", parameters);
    }

    public async Task AddOperTaskAsync(OperTask task)
    {
        await _dbContext.OperTasks.AddAsync(task);
        await _dbContext.SaveChangesAsync();
    }
}
