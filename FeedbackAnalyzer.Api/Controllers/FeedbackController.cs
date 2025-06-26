using System.Globalization;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using FeedbackAnalyzer.Api;            // AnalyzerContext lives here
using FeedbackAnalyzer.Api.Models;
using FeedbackAnalyzer.Api.Services;

namespace FeedbackAnalyzer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly AnalyzerContext _context;
        private readonly FeedbackAnalyzerService _analyzer;

        public FeedbackController(AnalyzerContext context, FeedbackAnalyzerService analyzer)
        {
            _context  = context;
            _analyzer = analyzer;
        }

        // ───────────────────────────────────────────────
        // 1) Single-text analysis
        //    POST  /api/feedback/analyze
        // ───────────────────────────────────────────────
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
                Tone            = tone,
                Urgency         = urgency,
                Topic           = topic
            };
            _context.AnalysisResults.Add(result);
            await _context.SaveChangesAsync();

            return Ok(new { feedback.Id, tone, urgency, topic });
        }

        // ───────────────────────────────────────────────
        // 2) CSV upload
        //    POST  /api/feedback/upload   (multipart/form-data, key = file)
        // ───────────────────────────────────────────────
        public class FeedbackCsvRow
        {
            public string Text { get; set; } = string.Empty;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB (adjust as needed)
        public async Task<IActionResult> UploadCsv([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No CSV file uploaded.");

            var processed = new List<object>();
            var failed    = new List<string>();

            using var reader = new StreamReader(file.OpenReadStream());
            using var csv    = new CsvReader(reader, CultureInfo.InvariantCulture);

            var records = csv.GetRecords<FeedbackCsvRow>();

            foreach (var row in records)
            {
                if (string.IsNullOrWhiteSpace(row.Text))
                    continue;

                try
                {
                    var feedback = new FeedbackEntry { Text = row.Text };
                    _context.FeedbackEntries.Add(feedback);
                    await _context.SaveChangesAsync();

                    var (tone, urgency, topic) = await _analyzer.AnalyzeAsync(row.Text);

                    var result = new AnalysisResult
                    {
                        FeedbackEntryId = feedback.Id,
                        Tone            = tone,
                        Urgency         = urgency,
                        Topic           = topic
                    };
                    _context.AnalysisResults.Add(result);
                    await _context.SaveChangesAsync();

                    processed.Add(new
                    {
                        feedback.Id,
                        feedback.Text,
                        Tone     = tone,
                        Urgency  = urgency,
                        Topic    = topic
                    });
                }
                catch
                {
                    failed.Add(row.Text);
                }
            }

            return Ok(new
            {
                total   = processed.Count + failed.Count,
                success = processed.Count,
                failed  = failed.Count,
                results = processed
            });
        }

        // ───────────────────────────────────────────────
        // 3) Retrieve ALL feedback + analysis
        //    GET  /api/feedback
        // ───────────────────────────────────────────────
        [HttpGet]
        public IActionResult GetAll()
        {
            var data =
                from entry  in _context.FeedbackEntries
                join result in _context.AnalysisResults
                     on entry.Id equals result.FeedbackEntryId
                orderby result.AnalyzedAt descending
                select new
                {
                    entry.Id,
                    entry.Text,
                    result.Tone,
                    result.Urgency,
                    result.Topic,
                    result.AnalyzedAt
                };

            return Ok(data.ToList());
        }
    }
}
