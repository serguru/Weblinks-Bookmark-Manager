using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class UserMessageModel
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string Asubject { get; set; } = null!;

    public string Amessage { get; set; } = null!;

    public DateTime? UtcDate { get; set; }

}
