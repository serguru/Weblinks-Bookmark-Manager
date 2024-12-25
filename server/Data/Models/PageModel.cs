using server.Data.Entities;
using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class PageModel
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string PagePath { get; set; } = null!;

    public string? Caption { get; set; }

    public virtual ICollection<LrowModel> Lrows { get; set; } = new List<LrowModel>();
}
