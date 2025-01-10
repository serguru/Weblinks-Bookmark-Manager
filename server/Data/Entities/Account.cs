using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class Account
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public string UserEmail { get; set; } = null!;

    public bool IsAdmin { get; set; }

    public string HashedPassword { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Settings { get; set; }

    public virtual ICollection<Page> Pages { get; set; } = new List<Page>();

    public virtual ICollection<UserMessage> UserMessages { get; set; } = new List<UserMessage>();
}
