using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class Lrow
{
    public int Id { get; set; }

    public int PageId { get; set; }

    public string? Caption { get; set; }

    public virtual ICollection<Lcolumn> Lcolumns { get; set; } = new List<Lcolumn>();

    public virtual Page Page { get; set; } = null!;
}
