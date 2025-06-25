namespace FeedbackAnalyzer.Api.Models
{
    public class FeedbackEntry
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;
    }
}