using Microsoft.AspNetCore.Mvc;
using FeedbackAnalyzer.Api.Models;
using FeedbackAnalyzer.Api; // ✅ Because AnalyzerContext.cs is in the root namespace

using FeedbackAnalyzer.Api.Services;


[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly AnalyzerContext _context;
    private readonly FeedbackAnalyzerService _analyzer;

    public FeedbackController(AnalyzerContext context, FeedbackAnalyzerService analyzer)
    {
        _context = context;
        _analyzer = analyzer;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> Analyze([FromBody] string feedbackText)
    {
        var feedback = new FeedbackEntry { Text = feedbackText };
        _context.FeedbackEntries.Add(feedback);
        await _context.SaveChangesAsync();

        var (tone, urgency, topic) = await _analyzer.AnalyzeAsync(feedbackText);


        var result = new AnalysisResult
        {
            FeedbackEntryId = feedback.Id,
            Tone = tone,
            Urgency = urgency,
            Topic = topic
        };

        _context.AnalysisResults.Add(result);
        await _context.SaveChangesAsync();

        return Ok(new { feedback.Id, tone, urgency, topic });
    }
}
