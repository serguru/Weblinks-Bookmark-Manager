using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class TaskType
{
    public int Id { get; set; }

    public string TypeName { get; set; } = null!;

    public string? EmailSubject { get; set; }

    public string? EmailTemplate { get; set; }

    public virtual ICollection<ArchiveTask> ArchiveTasks { get; set; } = new List<ArchiveTask>();

    public virtual ICollection<OperTask> OperTasks { get; set; } = new List<OperTask>();
}
