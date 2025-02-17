using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class SystemInfo
{
    public int Id { get; set; }

    public string? Comment { get; set; }

    public DateTime UtcStartDate { get; set; }

    public DateTime? UtcEndDate { get; set; }
}
