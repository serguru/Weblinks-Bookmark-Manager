using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class Link
{
    public int Id { get; set; }

    public int ColumnId { get; set; }

    public string AUrl { get; set; } = null!;

    public string Caption { get; set; } = null!;

    public virtual Lcolumn Column { get; set; } = null!;
}
