using AutoMapper;
using server.Data;
using server.Data.Entities;
using server.Data.Models;

namespace server.Services;

public class PagesService(IPagesRepository pagesRepository, IMapper mapper) : IPagesService
{
    private readonly IPagesRepository _pagesRepository = pagesRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<List<PageModel>> GetAllPagesAsync(int? accountId = null)
    {
        List<Page> entities = await _pagesRepository.GetAllPagesAsync(accountId);
        List<PageModel> models = _mapper.Map<List<PageModel>>(entities);
        return models;
    }

    public async Task AddPageAsync(PageModel page)
    {
        Page raw = _mapper.Map<Page>(page);
        //raw.Id = 0;
        //raw.PagePath = raw.PagePath + "AAA1";
        //raw.Lrows = null;
        await _pagesRepository.AddPageAsync(raw);
    }

    public Task DeletePageAsync(int pageId)
    {
        throw new NotImplementedException();
    }

    public Task<PageModel?> GetPageByIdAsync(int pageId)
    {
        throw new NotImplementedException();
    }

    public Task UpdatePageAsync(PageModel page)
    {
        throw new NotImplementedException();
    }
}


