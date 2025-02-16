using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Common;
using server.Data.Entities;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace server.Data;

public class TasksRepository(Links3dbContext dbContext, IHttpContextAccessor httpContextAccessor) : BaseRepository(dbContext, httpContextAccessor), ITasksRepository
{
    public async Task<List<OperTask>> OperTasksAsync(WeblinksTaskType? taskType = null)
    {
        IQueryable<OperTask> query =
            _dbContext.OperTasks
            .Include(x => x.History)
            .Include(x => x.TaskType)
            .AsQueryable();

        if (taskType != null)
        {
            query = query.Where(x => x.TaskTypeId == (int)taskType);
        }

        List<OperTask> result = await query.ToListAsync();
        
        return result;
    }

    public async Task ArchiveOperTask(int operTaskId, string comment, string subject, string body)
    {
        var parameters = new[]
        {
            new SqlParameter("@operTaskId", operTaskId),
            new SqlParameter("@comment", comment),
            new SqlParameter("@subject", subject),
            new SqlParameter("@body", body),
        };
        await _dbContext.Database.ExecuteSqlRawAsync("exec ArchiveOperTask @operTaskId, @comment, @subject, @body", parameters);
    }

    public async Task AddOperTaskAsync(OperTask task)
    {
        await _dbContext.OperTasks.AddAsync(task);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AddOrUpdateAliveAsync()
    {
        SystemInfo? systemInfo = await _dbContext.SystemInfos.FirstOrDefaultAsync(x => x.Id == 1);

        if ( systemInfo == null)
        {
            systemInfo = new SystemInfo()
            {
                Id = 1,
                Comment = "Alive",
                UtcDate = DateTime.UtcNow

            };
            await _dbContext.SystemInfos.AddAsync(systemInfo);
        } else
        {
            systemInfo.UtcDate = DateTime.UtcNow;
            _dbContext.SystemInfos.Update(systemInfo);
        }

        await _dbContext.SaveChangesAsync();
    }
}
