using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class UserMessage
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string Asubject { get; set; } = null!;

    public string Amessage { get; set; } = null!;

    public DateTime? UtcDate { get; set; }

    public virtual Account Account { get; set; } = null!;
}
