using Microsoft.EntityFrameworkCore;
using FeedbackAnalyzer.Api.Models;

public class AnalyzerContext : DbContext
{
    public AnalyzerContext(DbContextOptions<AnalyzerContext> options) : base(options) { }

    public DbSet<FeedbackEntry> FeedbackEntries { get; set; }
    public DbSet<AnalysisResult> AnalysisResults { get; set; }
}
