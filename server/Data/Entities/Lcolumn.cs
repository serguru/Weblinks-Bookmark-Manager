using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class Lcolumn
{
    public int Id { get; set; }

    public int RowId { get; set; }

    public string? Caption { get; set; }

    public virtual ICollection<Link> Links { get; set; } = new List<Link>();

    public virtual Lrow Row { get; set; } = null!;
}
