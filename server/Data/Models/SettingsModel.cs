using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace server.Data.Models;


public class SettingsLinkModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

}

public class SettingsColumnModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("links")]
    public List<SettingsLinkModel> Links { get; set; } = new List<SettingsLinkModel>();

}

public class SettingsRowModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("lcolumns")]
    public List<SettingsColumnModel> Lcolumns { get; set; } = new List<SettingsColumnModel>();

}

public class SettingsPageModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("readOnly")]
    public bool ReadOnly { get; set; }

    [JsonPropertyName("public")]
    public bool Public { get; set; }

    [JsonPropertyName("lrows")]
    public List<SettingsRowModel> Lrows { get; set; } = new List<SettingsRowModel>();
}

public class SettingsModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("pages")]
    public List<SettingsPageModel> Pages { get; set; } = new List<SettingsPageModel>();

}
