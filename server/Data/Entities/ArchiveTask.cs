using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class ArchiveTask
{
    public int Id { get; set; }

    public int HistoryId { get; set; }

    public int TaskTypeId { get; set; }

    public DateTime? CompletedUtcDate { get; set; }

    public string? Comment { get; set; }

    public virtual History History { get; set; } = null!;

    public virtual TaskType TaskType { get; set; } = null!;
}
