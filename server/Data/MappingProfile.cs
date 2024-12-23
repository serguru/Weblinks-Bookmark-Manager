using AutoMapper;
using server.Data.Entities;
using server.Data.Models;

namespace server.Data;

public class MappingProfile: Profile
{

    public MappingProfile()
    {
        CreateMap<PageModel, PageEntity>();
        CreateMap<PageEntity, PageModel>();

        CreateMap<AccountModel, AccountEntity>();
        CreateMap<AccountEntity, AccountModel>();

    }
}
