using System.Text.Json;
using OpenAI.Interfaces;
using OpenAI.ObjectModels;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;



using System.Text.Json;

namespace FeedbackAnalyzer.Api.Services
{
    public class FeedbackAnalyzerService
    {
        private readonly IOpenAIService _openAi;

        public FeedbackAnalyzerService(IOpenAIService openAi) => _openAi = openAi;

        public async Task<(string Tone, string Urgency, string Topic)> AnalyzeAsync(string text)
        {
            var prompt =
                "Classify the following customer feedback:\n" +
                "- Tone: Positive, Negative, Neutral\n" +
                "- Urgency: High, Medium, Low\n" +
                "- Topic: Billing, Shipping, Technical Issue, Product Feedback\n\n" +
                $"Feedback: \"{text}\"\n\n" +
                "Respond only with JSON:\n" +
                "{ \"tone\": \"...\", \"urgency\": \"...\", \"topic\": \"...\" }";

            var chatRequest = new ChatCompletionCreateRequest
            {
                Messages = new List<ChatMessage>
        {
            ChatMessage.FromSystem("You are a helpful assistant that classifies customer feedback."),
            ChatMessage.FromUser(prompt)
        },
                Model = OpenAI.ObjectModels.Models.Gpt_3_5_Turbo,

                Temperature = 0.3f,
                MaxTokens = 150
            };

            var resp = await _openAi.ChatCompletion.CreateCompletion(chatRequest);

            if (!resp.Successful)
                throw new InvalidOperationException(resp.Error?.Message ?? "OpenAI error");

            var json = resp.Choices.First().Message.Content.Trim();
            var dict = JsonSerializer.Deserialize<Dictionary<string, string>>(json)!;

            return (dict["tone"], dict["urgency"], dict["topic"]);
        }
    }
}
