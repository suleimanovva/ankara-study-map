using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnkaraStudyMap.Models;

[Table("spots")]
public class Spot
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Column("district_id")]
    public int DistrictId { get; set; }

    [ForeignKey("DistrictId")]
    public District? District { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("google_maps_link")]
    public string? GoogleMapsLink { get; set; }

    [Column("latitude")]
    public decimal Latitude { get; set; }

    [Column("longitude")]
    public decimal Longitude { get; set; }

    [Column("wifi_rating")]
    public int WifiRating { get; set; }

    [Column("quiet_rating")]
    public int QuietRating { get; set; }

    [Column("outlet_availability")]
    public bool OutletAvailability { get; set; }

    [Column("has_food")]
    public bool HasFood { get; set; }

    [Column("is_approved")]
    public bool IsApproved { get; set; } = true;

    [Column("is_deleted")]
    public bool IsDeleted { get; set; } = false;
} 