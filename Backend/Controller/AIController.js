const { GoogleGenerativeAI } = require("@google/generative-ai");

const getCompanyAnalysis = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment');
      return res.status(200).json({
        success: true,
        analysis: getStaticAnalysis(symbol)
      });
    }

    // Extract company name from symbol
    const companyNames = {
      'RELIANCE.BSE': 'Reliance Industries',
      'TCS.BSE': 'Tata Consultancy Services (TCS)',
      'HDFCBANK.BSE': 'HDFC Bank',
      'ICICIBANK.BSE': 'ICICI Bank',
      'SBIN.BSE': 'State Bank of India (SBI)'
    };

    const companyName = companyNames[symbol.toUpperCase()] || symbol;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a financial analyst. Provide a brief analysis of ${companyName} (Indian stock: ${symbol}) for investors.

Format your response EXACTLY as JSON with this structure:
{
  "company": "${companyName}",
  "latestNews": "Brief 1-2 sentence summary of recent news or developments (if none, say 'No major recent news')",
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "recommendation": "Brief 1 sentence investment outlook"
}

Keep each point concise (under 15 words). Return ONLY valid JSON, no markdown.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini response:', text);

      // Parse the JSON response
      let cleanText = text.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      }
      
      const analysis = JSON.parse(cleanText);

      return res.status(200).json({
        success: true,
        analysis
      });

    } catch (aiError) {
      console.error('Gemini API error:', aiError.message);
      // Return static analysis as fallback
      return res.status(200).json({
        success: true,
        analysis: getStaticAnalysis(symbol)
      });
    }

  } catch (err) {
    console.error('getCompanyAnalysis error:', err);
    return res.status(200).json({ 
      success: true,
      analysis: getStaticAnalysis(req.params.symbol)
    });
  }
};

// Static fallback analysis
function getStaticAnalysis(symbol) {
  const staticData = {
    'RELIANCE.BSE': {
      company: 'Reliance Industries',
      latestNews: 'Reliance continues to expand its retail and digital services divisions.',
      pros: ['Diversified business portfolio', 'Strong market leadership', 'Consistent revenue growth'],
      cons: ['High debt levels', 'Oil & gas sector volatility', 'Regulatory challenges'],
      recommendation: 'A blue-chip stock suitable for long-term investors.'
    },
    'TCS.BSE': {
      company: 'Tata Consultancy Services',
      latestNews: 'TCS secured major digital transformation contracts globally.',
      pros: ['Strong order book', 'Excellent profit margins', 'Global client base'],
      cons: ['Rupee appreciation risk', 'Talent retention challenges', 'Competition from peers'],
      recommendation: 'Stable IT bellwether for conservative investors.'
    },
    'HDFCBANK.BSE': {
      company: 'HDFC Bank',
      latestNews: 'HDFC Bank completed merger and integration with HDFC Ltd.',
      pros: ['Strong asset quality', 'Digital banking leader', 'Excellent management'],
      cons: ['Post-merger integration risks', 'Rising interest rates impact', 'Competition from fintechs'],
      recommendation: 'Premium private bank with solid fundamentals.'
    },
    'ICICIBANK.BSE': {
      company: 'ICICI Bank',
      latestNews: 'ICICI Bank reports strong quarterly growth in loans and deposits.',
      pros: ['Improving asset quality', 'Strong digital presence', 'Good loan growth'],
      cons: ['Corporate loan exposure', 'Market competition', 'Interest rate sensitivity'],
      recommendation: 'Well-positioned for growth in the banking sector.'
    },
    'SBIN.BSE': {
      company: 'State Bank of India',
      latestNews: 'SBI maintains leadership position in public sector banking.',
      pros: ['Largest bank by assets', 'Government backing', 'Wide branch network'],
      cons: ['NPA concerns', 'Public sector bureaucracy', 'Technology upgrades needed'],
      recommendation: 'Value pick among PSU banks with improving metrics.'
    }
  };

  return staticData[symbol.toUpperCase()] || {
    company: symbol,
    latestNews: 'Analysis for this stock is being prepared.',
    pros: ['Market presence', 'Industry position', 'Growth potential'],
    cons: ['Market risks', 'Competition', 'Economic factors'],
    recommendation: 'Please conduct your own research before investing.'
  };
}

module.exports = {
  getCompanyAnalysis
};
