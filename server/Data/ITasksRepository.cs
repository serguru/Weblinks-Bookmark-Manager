using server.Data.Entities;
using server.Common;

namespace server.Data;

public interface ITasksRepository
{
    Task AddOperTaskAsync(OperTask task);
    Task<List<OperTask>> OperTasksAsync(WeblinksTaskType? taskType = null);
    Task ArchiveOperTask(int operTaskId, string comment, string subject, string body);
    Task<SystemInfo> AddAliveStartAsync();
    Task UpdateAliveEndAsync(SystemInfo systemInfo);

    Task<SystemInfo> AddSystemInfoAsync(string message);
}

