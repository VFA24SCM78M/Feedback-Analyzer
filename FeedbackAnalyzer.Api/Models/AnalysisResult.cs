namespace FeedbackAnalyzer.Api.Models
{
    public class AnalysisResult
    {
        public int Id { get; set; }
        public int FeedbackEntryId { get; set; }
        public string Tone { get; set; }
        public string Urgency { get; set; }
        public string Topic { get; set; }
        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
        public FeedbackEntry FeedbackEntry { get; set; }
    }
}