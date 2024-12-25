using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class LinkModel
{
    public int Id { get; set; }

    public int ColumnId { get; set; }

    public string AUrl { get; set; } = null!;

    public string Caption { get; set; } = null!;

}
