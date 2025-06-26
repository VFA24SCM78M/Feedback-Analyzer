import { useState } from "react";
import { MessageSquare, Zap, Target, TrendingUp, Sparkles, Send, Brain, Eye } from "lucide-react";

export default function AnalyzeFeedback() {
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    // Simulate API call with enhanced mock data
    setTimeout(() => {
      const mockResult = {
        tone: "Negative",
        urgency: "High",
        topic: "Billing",
        sentiment: "Frustrated",
        confidence: 94,
        keywords: ["refund", "billing", "issue", "urgent"],
        category: "Customer Service",
        priority: "Critical"
      };
      setResult(mockResult);
      setLoading(false);
    }, 2000);
  };

  const getToneColor = (tone) => {
    switch(tone?.toLowerCase()) {
      case 'positive': return 'from-emerald-400 to-green-500';
      case 'negative': return 'from-red-400 to-rose-500';
      case 'neutral': return 'from-blue-400 to-indigo-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency?.toLowerCase()) {
      case 'high': return 'from-orange-400 to-red-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'low': return 'from-green-400 to-emerald-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: `float 6s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4">
              AI Feedback Analyzer
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Harness the power of advanced AI to decode customer sentiment, extract insights, and prioritize responses with surgical precision.
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 mb-8">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Feedback
                </label>
                <div className="relative">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Paste your customer feedback here and watch our AI work its magic..."
                    rows={6}
                    className="w-full p-6 bg-gray-900/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all duration-300 placeholder-gray-400 text-lg leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                    {feedback.length} characters
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full relative overflow-hidden group py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading || !feedback.trim()}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Analyze Feedback</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </div>
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {result && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                  <p className="text-gray-400">AI-powered insights ready</p>
                </div>
                <div className="ml-auto bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  <span className="text-emerald-300 text-sm font-medium">{result.confidence}% Confidence</span>
                </div>
              </div>

              {/* Primary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="group relative overflow-hidden bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-2xl"></div>
                  <Zap className="w-8 h-8 text-purple-400 mb-3" />
                  <p className="text-sm font-medium text-gray-400 mb-1">TONE ANALYSIS</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getToneColor(result.tone)} text-white shadow-lg`}>
                      {result.tone}
                    </span>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-2xl"></div>
                  <TrendingUp className="w-8 h-8 text-orange-400 mb-3" />
                  <p className="text-sm font-medium text-gray-400 mb-1">URGENCY LEVEL</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getUrgencyColor(result.urgency)} text-white shadow-lg`}>
                      {result.urgency}
                    </span>
                  </div>
                </div>

                <div className="group relative overflow-hidden bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-2xl"></div>
                  <Target className="w-8 h-8 text-cyan-400 mb-3" />
                  <p className="text-sm font-medium text-gray-400 mb-1">TOPIC CATEGORY</p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg">
                      {result.topic}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Key Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Sentiment</span>
                      <span className="text-white font-semibold">{result.sentiment}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Category</span>
                      <span className="text-white font-semibold">{result.category}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Priority</span>
                      <span className="text-red-400 font-semibold">{result.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    Keywords Detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 rounded-full text-sm font-medium border border-gray-600/50 hover:border-purple-500/50 transition-colors cursor-default"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
}