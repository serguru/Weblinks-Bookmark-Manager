using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class History
{
    public int Id { get; set; }

    public int EventTypeId { get; set; }

    public string? UserEmail { get; set; }

    public DateTime? UtcDate { get; set; }

    public string? Comment { get; set; }

    public virtual EventType EventType { get; set; } = null!;
}
