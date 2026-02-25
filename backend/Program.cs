using Microsoft.EntityFrameworkCore;
using AnkaraStudyMap.Data;
using AnkaraStudyMap.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Swagger and Controllers (Essential for Roa and Maftuna to test the API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// 2. PostgreSQL Connection via Nigara's AppDbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Dependency Injection: Register Nigara's Venue Repository (Sprint 2 Objective)
// This tells the system to use VenueRepository whenever IVenueRepository is required
builder.Services.AddScoped<IVenueRepository, VenueRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Visual interface for Roa to see the endpoints
}

app.UseHttpsRedirection();
app.UseAuthorization();

// 4. Map API Controllers (Enables the Application Layer for Roa)
app.MapControllers();

app.Run();