import React, { useState, useEffect } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown, Sparkles, Loader2 } from "lucide-react";

const ArticlePage = ({ selectedStock }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStock) {
      setAnalysis(null);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:5000/api/ai/analysis/${selectedStock}`,
          { withCredentials: true }
        );
        setAnalysis(response.data.analysis);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Failed to load analysis");
        // Use fallback from error response if available
        if (err.response?.data?.analysis) {
          setAnalysis(err.response.data.analysis);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedStock]);

  if (!selectedStock) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Sparkles className="mx-auto mb-2 text-purple-400" size={32} />
        <p className="text-sm">Select a stock to see AI analysis</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="animate-spin mx-auto mb-2 text-purple-500" size={32} />
        <p className="text-sm text-gray-600">Analyzing {selectedStock}...</p>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="p-4 text-center text-red-500">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-purple-500" size={18} />
        <h3 className="text-sm font-bold text-gray-800">AI Analysis</h3>
      </div>

      {/* Company */}
      <p className="text-xs font-semibold text-purple-700 mb-2">{analysis.company}</p>

      {/* Latest News */}
      <div className="bg-white rounded-md p-2 mb-3 shadow-sm">
        <p className="text-xs font-medium text-gray-700 mb-1">📰 Latest</p>
        <p className="text-xs text-gray-600">{analysis.latestNews}</p>
      </div>

      {/* Pros */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1">
          <ThumbsUp size={14} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">Pros</span>
        </div>
        <ul className="space-y-1">
          {analysis.pros?.map((pro, i) => (
            <li key={i} className="text-xs text-gray-700 bg-green-50 px-2 py-1 rounded border-l-2 border-green-400">
              {pro}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1">
          <ThumbsDown size={14} className="text-red-600" />
          <span className="text-xs font-semibold text-red-700">Cons</span>
        </div>
        <ul className="space-y-1">
          {analysis.cons?.map((con, i) => (
            <li key={i} className="text-xs text-gray-700 bg-red-50 px-2 py-1 rounded border-l-2 border-red-400">
              {con}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="bg-purple-100 rounded-md p-2">
        <p className="text-xs font-medium text-purple-800">💡 {analysis.recommendation}</p>
      </div>
    </div>
  );
};

export default ArticlePage;
