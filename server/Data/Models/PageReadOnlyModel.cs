using server.Data.Entities;
using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class PageReadOnlyModel
{
    public int Id { get; set; }
    public bool IsReadOnly { get; set; }

}
