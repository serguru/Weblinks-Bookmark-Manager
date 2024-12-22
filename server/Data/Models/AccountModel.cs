using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class AccountModel
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public byte[] HashedPassword { get; set; } = null!;

    public byte[] Salt { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public virtual ICollection<PageModel> Pages { get; set; } = new List<PageModel>();
}
