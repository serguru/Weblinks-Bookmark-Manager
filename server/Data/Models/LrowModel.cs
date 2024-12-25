using server.Data.Entities;
using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class LrowModel
{
    public int Id { get; set; }

    public int PageId { get; set; }

    public string? Caption { get; set; }

    public virtual ICollection<LcolumnModel> Lcolumns { get; set; } = new List<LcolumnModel>();
}
