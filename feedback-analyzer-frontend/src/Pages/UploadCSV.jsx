import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, BarChart3, MessageSquare, Clock, AlertTriangle, Zap, Target } from "lucide-react";

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [feedbackResults, setFeedbackResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadSummary(null);
    setFeedbackResults([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setUploadSummary(null);
      setFeedbackResults([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setUploadSummary(null);
    setFeedbackResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5238/api/feedback/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setUploadSummary({ total: result.total, success: result.success, failed: result.failed });
      setFeedbackResults(result.results || []);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getToneColor = (tone) => {
    switch (tone?.toLowerCase()) {
      case 'positive': return 'text-emerald-400 bg-emerald-400/10';
      case 'negative': return 'text-red-400 bg-red-400/10';
      case 'neutral': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-orange-400 bg-orange-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTopicColor = (topic) => {
    const colors = [
      'text-purple-400 bg-purple-400/10',
      'text-pink-400 bg-pink-400/10',
      'text-indigo-400 bg-indigo-400/10',
      'text-cyan-400 bg-cyan-400/10',
      'text-teal-400 bg-teal-400/10',
    ];
    return colors[topic?.length % colors.length] || 'text-gray-400 bg-gray-400/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Feedback Analyzer</h1>
          <p className="text-gray-400">Upload your CSV file to analyze customer feedback with AI</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
              dragOver
                ? 'border-purple-400 bg-purple-400/10'
                : file
                ? 'border-green-400 bg-green-400/5'
                : 'border-gray-600 hover:border-purple-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="text-center">
              {file ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full">
                    <FileText className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{file.name}</h3>
                    <p className="text-gray-400">Ready to analyze</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Drop your CSV file here</h3>
                    <p className="text-gray-400">or click to browse files</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Feedback...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Upload & Analyze</span>
              </div>
            )}
          </button>
        </div>

        {/* Upload Summary */}
        {uploadSummary && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center space-x-4 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Analysis Complete</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400">{uploadSummary.total}</div>
                <div className="text-sm text-gray-400">Total Records</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{uploadSummary.success}</div>
                <div className="text-sm text-gray-400">Processed</div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{uploadSummary.failed}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Results */}
        {feedbackResults.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 animate-in slide-in-from-bottom duration-700">
            <div className="flex items-center space-x-4 mb-6">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Feedback Insights</h2>
            </div>
            
            <div className="space-y-4">
              {feedbackResults.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4">
                    <p className="text-gray-300 italic leading-relaxed">"{item.text}"</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getToneColor(item.tone)}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">Tone: {item.tone}</span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getUrgencyColor(item.urgency)}`}>
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Urgency: {item.urgency}</span>
                    </div>
                    
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getTopicColor(item.topic)}`}>
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Topic: {item.topic}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}