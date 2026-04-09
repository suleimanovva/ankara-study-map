using Microsoft.EntityFrameworkCore;
using AnkaraStudyMap.Models;

namespace AnkaraStudyMap.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<District> Districts { get; set; }
    public DbSet<Spot> Spots { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Additional configuration can go here
    }
}  