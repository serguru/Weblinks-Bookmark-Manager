using server.Data.Entities;
using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class LcolumnModel
{
    public int Id { get; set; }

    public int RowId { get; set; }

    public string? Caption { get; set; }

    public virtual ICollection<LinkModel> Links { get; set; } = new List<LinkModel>();
}
