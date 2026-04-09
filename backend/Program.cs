using Microsoft.EntityFrameworkCore;
using AnkaraStudyMap.Data;
using AnkaraStudyMap.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- 1. ENABLE CORS ---
// This allows Maftuna's React app to talk to your API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // React & Vite ports
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// 2. PostgreSQL Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 3. Dependency Injection
builder.Services.AddScoped<IVenueRepository, VenueRepository>();

var app = builder.Build();

// --- 2. USE CORS ---
// Important: This must be placed between UseRouting and UseAuthorization
app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();