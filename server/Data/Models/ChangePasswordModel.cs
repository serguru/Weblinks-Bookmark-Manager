using System;
using System.Collections.Generic;

namespace server.Data.Models;

public partial class ChangePasswordModel
{

    public string OldPassword { get; set; } = null!;

    public string Password { get; set; } = null!;


}
