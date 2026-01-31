import React, { useEffect, useState } from "react";
import axios from "axios";

const ArticlePage = ({ selectedStock }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedStock) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.post(
          "http://127.0.0.1:8000/company_news",
          { company: selectedStock }
        );

        setArticle(res.data);
      } catch (err) {
        setError("Failed to load company news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedStock]);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading company news...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  if (!article) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Select a stock to view company news.
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-sm h-full overflow-y-auto border-l-4 ${article.sentiment === 1
        ? "border-green-500 bg-green-50"
        : "border-red-500 bg-red-50"
        }`}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {article.title}
      </h3>

      <p className="text-sm text-gray-700 leading-relaxed">
        {article.summary}
      </p>
    </div>
  );
};

export default ArticlePage;
