using AnkaraStudyMap.Models;

namespace AnkaraStudyMap.Repositories;

public interface IVenueRepository
{

    Task<IEnumerable<Spot>> GetVenuesByDistrictIdAsync(int districtId);
    
  
    Task<Spot?> GetVenueByIdAsync(int id);
    
   
    Task<IEnumerable<Spot>> GetAllVenuesAsync();
}