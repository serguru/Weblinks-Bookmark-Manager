using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class EventType
{
    public int Id { get; set; }

    public string TypeName { get; set; } = null!;

    public virtual ICollection<History> Histories { get; set; } = new List<History>();
}
