using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.EntityFrameworkCore;
using FeedbackAnalyzer.Api.Services;
using OpenAI.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// 1️⃣  CORS: add a named policy that allows localhost:5173
// ─────────────────────────────────────────────
const string FrontendCorsPolicy = "FrontendPolicy";

builder.Services.AddCors(opts =>
{
    opts.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")   // Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ─────────────────────────────────────────────
// Existing services
// ─────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AnalyzerContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("Default"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("Default"))
    ));

builder.Services.AddOpenAIService(opts =>
{
    opts.ApiKey = builder.Configuration["OpenAI:ApiKey"];
});

builder.Services.AddScoped<FeedbackAnalyzerService>();

var app = builder.Build();

// ─────────────────────────────────────────────
// 2️⃣  Use the CORS policy BEFORE routing
// ─────────────────────────────────────────────
app.UseCors(FrontendCorsPolicy);

// Swagger etc.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
