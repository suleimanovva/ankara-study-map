using Microsoft.EntityFrameworkCore;
using AnkaraStudyMap.Data;
using AnkaraStudyMap.Models;

namespace AnkaraStudyMap.Repositories;

public class VenueRepository : IVenueRepository
{
    private readonly AppDbContext _context;

    public VenueRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Spot>> GetVenuesByDistrictIdAsync(int districtId)
    {
        return await _context.Spots
            .Where(s => s.DistrictId == districtId && !s.IsDeleted && s.IsApproved)
            .Include(s => s.District) // Подтягиваем данные о районе
            .ToListAsync();
    }

    public async Task<Spot?> GetVenueByIdAsync(int id)
    {
        return await _context.Spots
            .Include(s => s.District)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
    }

    public async Task<IEnumerable<Spot>> GetAllVenuesAsync()
    {
        return await _context.Spots
            .Where(s => !s.IsDeleted && s.IsApproved)
            .Include(s => s.District)
            .ToListAsync();
    }
}