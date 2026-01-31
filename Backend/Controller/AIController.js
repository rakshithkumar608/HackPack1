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

const behavioralAnalysis = async (req, res) => {
  try {
    const { message, stockName, orderType, currentPrice } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found');
      return res.status(200).json({
        success: true,
        response: getStaticBehavioralResponse(message, orderType),
        isSound: false
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are a behavioral finance coach helping users make better trading decisions. The user is considering a ${orderType?.toUpperCase() || 'TRADE'} order for ${stockName || 'a stock'} at price ₹${currentPrice || 'current market price'}.

STRICT INSTRUCTIONS - FOLLOW EXACTLY:

You are helping the user improve decision quality under uncertainty, NOT optimize for profit or accuracy.
If the user's reasoning is incomplete, guide — do not correct.

FIRST: Assess if the user's reasoning is FINANCIALLY SOUND.
A reasoning is considered SOUND if it mentions ANY of these:
- Risk management / stop loss / position sizing
- Time horizon (short-term vs long-term plan)
- Fundamental analysis (company financials, earnings, valuation)
- Technical analysis with proper context (not just "chart going up")
- Portfolio diversification
- Clear exit strategy
- Understanding of downside risk

A reasoning is NOT SOUND if it only mentions:
- "Chart going up/down" without further context
- FOMO (fear of missing out)
- Following tips/advice without own research
- Emotional decisions (excitement, fear, hope)
- No mention of risk or exit plan

Start your response with exactly one of these on its own line:
ASSESSMENT: SOUND
or
ASSESSMENT: NEEDS_IMPROVEMENT

Then provide your analysis:

**Understanding Your Reasoning**
(1-2 sentences acknowledging what the user is thinking. Reflect their reasoning in neutral terms. Do NOT say "right" or "wrong".)

**Behavioral Insight**
(1-2 sentences identifying common behavioral patterns if present like momentum chasing, loss aversion, overconfidence. Use soft language.)

**Financial Perspective**
(2-4 sentences of principle-based guidance focusing on: time horizon, risk awareness, position sizing, uncertainty. NEVER say "buy", "sell", or "hold". NEVER predict future prices.)

**Questions to Reflect On**
• Question 1 (about their decision criteria)
• Question 2 (about risk tolerance)
• Question 3 (about time horizon)

TONE: Calm, respectful, educational, non-authoritative.

User's intention: "${message}"`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      let text = response.text();

      let isSound = false;
      if (text.includes('ASSESSMENT: SOUND')) {
        isSound = true;
        text = text.replace('ASSESSMENT: SOUND', '').trim();
      } else if (text.includes('ASSESSMENT: NEEDS_IMPROVEMENT')) {
        isSound = false;
        text = text.replace('ASSESSMENT: NEEDS_IMPROVEMENT', '').trim();
      }

      return res.status(200).json({
        success: true,
        response: text,
        isSound: isSound
      });

    } catch (aiError) {
      console.error('Gemini behavioral analysis error:', aiError.message);
      return res.status(200).json({
        success: true,
        response: getStaticBehavioralResponse(message, orderType),
        isSound: false
      });
    }

  } catch (err) {
    console.error('behavioralAnalysis error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

function getStaticBehavioralResponse(intention, orderType) {
  const action = orderType === 'buy' ? 'purchasing' : 'selling';
  
  return `**Understanding Your Reasoning**
Your intention focuses on ${action} based on your current market observation. You appear to be making a considered decision based on the information available to you.

**Behavioral Insight**
Many investors often make decisions based on recent price trends. This is a common pattern known as momentum-based thinking, where recent price movement influences expectations about future direction.

**Financial Perspective**
Short-term price movements can be influenced by many factors and may not always indicate future direction. Investors often benefit from defining their time horizon and understanding how much volatility they are comfortable with. Position sizing relative to your overall portfolio is an important consideration regardless of the direction you expect.

**Questions to Reflect On**
• What would change your mind about this decision?
• How much of your capital are you comfortable risking if this moves against you?
• Are you making this decision for the next few days or the next few months?`;
}

module.exports = {
  getCompanyAnalysis,
  behavioralAnalysis
};

