import { useEffect, useState, useMemo } from "react";
import {
  Filter,
  RefreshCcw,
  Loader2,
  Search,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Clock,
  Target,
  Eye,
  Calendar,
  BarChart3,
  Zap,
  AlertCircle,
  CheckCircle,
  MinusCircle,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";

/* quick utility to group by key → counts */
const getCountMap = (arr, key) =>
  arr.reduce((map, o) => ((map[o[key]] = (map[o[key]] || 0) + 1), map), {});

export default function ViewFeedback() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toneFilter, setToneFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // cards or table
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  /* fetch once on mount */
  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5238/api/feedback");
        const data = await res.json();
        setRows(data);
      } catch (e) {
        setError("Failed to fetch feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchRows();
  }, []);

  /* derived – filtered rows */
  const filtered = useMemo(() => {
    return rows
      .filter((r) =>
        search ? r.text.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((r) => (toneFilter === "All" ? true : r.tone === toneFilter))
      .filter((r) =>
        urgencyFilter === "All" ? true : r.urgency === urgencyFilter
      );
  }, [rows, search, toneFilter, urgencyFilter]);

  /* quick stats */
  const toneCount = useMemo(() => getCountMap(filtered, "tone"), [filtered]);
  const urgencyCount = useMemo(
    () => getCountMap(filtered, "urgency"),
    [filtered]
  );
  const topicCount = useMemo(() => getCountMap(filtered, "topic"), [filtered]);

  const getToneIcon = (tone) => {
    switch (tone?.toLowerCase()) {
      case 'positive': return <CheckCircle className="w-4 h-4" />;
      case 'negative': return <AlertCircle className="w-4 h-4" />;
      case 'neutral': return <MinusCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getToneColor = (tone) => {
    switch (tone?.toLowerCase()) {
      case 'positive': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'negative': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'neutral': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTopicColor = (topic) => {
    const colors = [
      'text-purple-400 bg-purple-400/10 border-purple-400/20',
      'text-pink-400 bg-pink-400/10 border-pink-400/20',
      'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
      'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
      'text-teal-400 bg-teal-400/10 border-teal-400/20',
    ];
    return colors[topic?.length % colors.length] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Feedback Dashboard</h1>
              <p className="text-gray-400">Analyze and manage customer feedback</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "cards" 
                    ? "bg-purple-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "table" 
                    ? "bg-purple-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            {loading && <Loader2 className="w-6 h-6 animate-spin text-purple-400" />}
            {!loading && (
              <button
                onClick={() => window.location.reload()}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-lg border border-white/10 transition-all hover:scale-105"
              >
                <RefreshCcw className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Feedback</p>
                <p className="text-2xl font-bold text-white">{filtered.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Positive</p>
                <p className="text-2xl font-bold text-emerald-400">{toneCount.Positive || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Negative</p>
                <p className="text-2xl font-bold text-red-400">{toneCount.Negative || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-orange-400">{urgencyCount.High || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="w-5 h-5 absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <select
                value={toneFilter}
                onChange={(e) => setToneFilter(e.target.value)}
                className="bg-white/5 border border-white/10 p-3 pr-8 rounded-lg text-white appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="All">All Tones</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute top-4 right-3 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-white/5 border border-white/10 p-3 pr-8 rounded-lg text-white appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="All">All Urgency</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute top-4 right-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No feedback found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Cards View */}
        {viewMode === "cards" && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => setSelectedFeedback(item)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-gray-400">#{index + 1}</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.analyzedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>"{item.text}"</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getToneColor(item.tone)}`}>
                    {getToneIcon(item.tone)}
                    <span>{item.tone}</span>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getUrgencyColor(item.urgency)}`}>
                    <Zap className="w-3 h-3" />
                    <span>{item.urgency}</span>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getTopicColor(item.topic)}`}>
                    <Target className="w-3 h-3" />
                    <span>{item.topic}</span>
                  </div>
                </div>
                
                {/* <div className="flex items-center text-xs text-purple-400 hover:text-purple-300">
                  <Eye className="w-3 h-3 mr-1" />
                  Click to view details
                </div> */}
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && filtered.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Feedback</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tone</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Urgency</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedFeedback(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-md">
                        <div className="truncate">"{item.text}"</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getToneColor(item.tone)}`}>
                          {getToneIcon(item.tone)}
                          <span>{item.tone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getUrgencyColor(item.urgency)}`}>
                          <Zap className="w-3 h-3" />
                          <span>{item.urgency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getTopicColor(item.topic)}`}>
                          <Target className="w-3 h-3" />
                          <span>{item.topic}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(item.analyzedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Detail Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-white">Feedback Details</h3>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Feedback Text</label>
                    <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                      "{selectedFeedback.text}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Tone</label>
                      <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getToneColor(selectedFeedback.tone)}`}>
                        {getToneIcon(selectedFeedback.tone)}
                        <span className="text-sm">{selectedFeedback.tone}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Urgency</label>
                      <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getUrgencyColor(selectedFeedback.urgency)}`}>
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">{selectedFeedback.urgency}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Topic</label>
                      <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${getTopicColor(selectedFeedback.topic)}`}>
                        <Target className="w-4 h-4" />
                        <span className="text-sm">{selectedFeedback.topic}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Analyzed Date</label>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedFeedback.analyzedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}