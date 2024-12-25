using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class Page
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string PagePath { get; set; } = null!;

    public string? Caption { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Lrow> Lrows { get; set; } = new List<Lrow>();
}
