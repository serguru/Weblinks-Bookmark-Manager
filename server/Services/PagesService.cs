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

    public async Task<PageModel> AddPageAsync(PageModel page)
    {
        Page entity = _mapper.Map<Page>(page);
        await _pagesRepository.AddPageAsync(entity);
        PageModel result = _mapper.Map<PageModel>(entity);    
        return result;
    }

    public async Task DeletePageAsync(int pageId)
    {
        await _pagesRepository.DeletePageAsync(pageId);
    }

    public async Task<PageModel?> GetPageByIdAsync(int pageId)
    {
        Page? entity = await pagesRepository.GetPageByIdAsync(pageId);
        if (entity == null) 
        { 
            return null;
        }
        PageModel model = _mapper.Map<PageModel>(entity);
        return model;
    }

    public async Task<PageModel> UpdatePageAsync(PageModel page)
    {
        Page entity = _mapper.Map<Page>(page);
        await _pagesRepository.UpdatePageAsync(entity);
        PageModel model = _mapper.Map<PageModel>(entity);
        return model;
    }
}


