import React from "react";

const ArticlePage = ({ selectedStock }) => {
  const articles = {
    "RELIANCE.BSE": {
      title: "Reliance Industries Ltd.",
      description: "RELIANCE is India's largest company by market cap.",
      content:
        "Reliance Industries is a Fortune 500 company with diversified operations across oil and gas, petrochemicals, refining, and retail sectors. The company has been a key driver of India's economy.",
    },
    "TCS.BSE": {
      title: "Tata Consultancy Services",
      description: "TCS is a leading IT services and consulting company.",
      content:
        "Tata Consultancy Services (TCS) is an IT services, consulting, and business solutions organization that delivers real results to global business and customers.",
    },
    "HDFCBANK.BSE": {
      title: "HDFC Bank Limited",
      description: "HDFC Bank is a leading private sector bank in India.",
      content:
        "HDFC Bank is one of India's premier banking institutions, offering a wide range of financial products and services to retail and corporate customers.",
    },
    "ICICIBANK.BSE": {
      title: "ICICI Bank Limited",
      description:
        "ICICI Bank is a major banking and financial services company.",
      content:
        "ICICI Bank is a universal bank offering a comprehensive range of banking and financial services to retail and corporate customers.",
    },
    "SBIN.BSE": {
      title: "State Bank of India",
      description: "SBI is India's largest public sector bank.",
      content:
        "State Bank of India is the largest bank in India by assets. It is a multinational, publicly-owned banking and financial services statutory body.",
    },
  };

  const article = articles[selectedStock] || {
    title: "Select a Stock",
    description: "Click on a stock in the sidebar to view details.",
    content: "No stock selected yet.",
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm h-full overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{article.description}</p>
      <p className="text-xs text-gray-700 leading-relaxed">{article.content}</p>
    </div>
  );
};

export default ArticlePage;
