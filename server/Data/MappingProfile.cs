using AutoMapper;
using server.Data.Entities;
using server.Data.Models;

namespace server.Data;

public class MappingProfile: Profile
{
    public MappingProfile()
    {
        CreateMap<LinkModel, Link>();
        CreateMap<Link, LinkModel>();

        CreateMap<LcolumnModel, Lcolumn>();
        CreateMap<Lcolumn, LcolumnModel>();

        CreateMap<LrowModel, Lrow>();
        CreateMap<Lrow, LrowModel>();

        CreateMap<PageModel, Page>();
        CreateMap<Page, PageModel>();

        CreateMap<AccountModel, Account>();
        CreateMap<Account, AccountModel>();

        CreateMap<UserMessageModel, UserMessage>();
        CreateMap<UserMessage, UserMessageModel>();

    }
}
