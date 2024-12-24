using AutoMapper;
using server.Data.Entities;
using server.Data.Models;

namespace server.Data;

public class MappingProfile: Profile
{

    public MappingProfile()
    {
        CreateMap<PageModel, Page>();
        CreateMap<Page, PageModel>();

        CreateMap<AccountModel, Account>();
        CreateMap<Account, AccountModel>();

    }
}
