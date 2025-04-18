﻿using System;
using System.Collections.Generic;

namespace server.Data.Entities;

public partial class VwAccountsDatum
{
    public int AccountId { get; set; }

    public string UserName { get; set; } = null!;

    public string UserEmail { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int PageId { get; set; }

    public string PagePath { get; set; } = null!;

    public string? PageCaption { get; set; }

    public bool PageIsReadOnly { get; set; }

    public bool PageIsPublic { get; set; }

    public string? PageDescription { get; set; }

    public int RowId { get; set; }

    public string? RowCaption { get; set; }

    public int ColumnId { get; set; }

    public string? ColumnCaption { get; set; }

    public int LinkId { get; set; }

    public string LinkCaption { get; set; } = null!;

    public string LinkAurl { get; set; } = null!;
}
