using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class PageEntity
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string PagePath { get; set; } = null!;

    public string? Caption { get; set; }

}
