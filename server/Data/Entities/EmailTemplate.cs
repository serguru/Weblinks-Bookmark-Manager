using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class EmailTemplate
{
    public int Id { get; set; }

    public string TemplateName { get; set; } = null!;

    public string Template { get; set; } = null!;
}
