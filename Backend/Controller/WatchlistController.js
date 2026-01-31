const Watchlist = require('../Schemas/WatchlistSchema');
const axios = require('axios');

// Alpha Vantage API key (same as used in StockController)
const API_KEY = 'V1T2LI6LDNP0XGSD';

// Get or create watchlist for user
const getOrCreateWatchlist = async (userId) => {
  let watchlist = await Watchlist.findOne({ userId });
  if (!watchlist) {
    watchlist = new Watchlist({ userId, stocks: [] });
    await watchlist.save();
  }
  return watchlist;
};

// Fetch stock data from Alpha Vantage
const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    const quote = response.data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      // Return mock data if API limit reached
      return getMockStockData(symbol);
    }
    
    return {
      symbol: quote['01. symbol'] || symbol,
      price: parseFloat(quote['05. price']) || 0,
      change: parseFloat(quote['09. change']) || 0,
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
      high: parseFloat(quote['03. high']) || 0,
      low: parseFloat(quote['04. low']) || 0,
      open: parseFloat(quote['02. open']) || 0,
      previousClose: parseFloat(quote['08. previous close']) || 0,
      volume: parseInt(quote['06. volume']) || 0
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return getMockStockData(symbol);
  }
};

// Mock data for when API limit is reached
const getMockStockData = (symbol) => {
  const mockData = {
    'RELIANCE.BSE': { price: 2450.50, change: 25.30, changePercent: 1.04, high: 2475.00, low: 2420.00 },
    'TCS.BSE': { price: 3890.25, change: -15.75, changePercent: -0.40, high: 3920.00, low: 3850.00 },
    'HDFCBANK.BSE': { price: 1650.80, change: 12.40, changePercent: 0.76, high: 1670.00, low: 1635.00 },
    'ICICIBANK.BSE': { price: 1125.60, change: -8.20, changePercent: -0.72, high: 1145.00, low: 1110.00 },
    'SBIN.BSE': { price: 785.40, change: 6.80, changePercent: 0.87, high: 795.00, low: 778.00 },
    'INFY.BSE': { price: 1580.00, change: 22.50, changePercent: 1.44, high: 1595.00, low: 1555.00 },
    'WIPRO.BSE': { price: 425.30, change: -3.20, changePercent: -0.75, high: 432.00, low: 420.00 },
    'BHARTIARTL.BSE': { price: 1450.75, change: 18.90, changePercent: 1.32, high: 1465.00, low: 1430.00 },
  };
  
  const data = mockData[symbol] || { 
    price: 1000 + Math.random() * 500, 
    change: (Math.random() - 0.5) * 50,
    changePercent: (Math.random() - 0.5) * 3,
    high: 1000 + Math.random() * 600,
    low: 900 + Math.random() * 400
  };
  
  return {
    symbol: symbol,
    ...data,
    open: data.price - data.change,
    previousClose: data.price - data.change,
    volume: Math.floor(Math.random() * 1000000)
  };
};

// Get user's watchlist with stock data
const getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const watchlist = await getOrCreateWatchlist(userId);
    
    // Fetch real-time data for each stock
    const stocksWithData = await Promise.all(
      watchlist.stocks.map(async (item) => {
        const stockData = await fetchStockData(item.symbol);
        return {
          ...stockData,
          addedAt: item.addedAt
        };
      })
    );
    
    res.json({
      success: true,
      watchlist: stocksWithData
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

// Add stock to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    
    const watchlist = await getOrCreateWatchlist(userId);
    
    // Check if already in watchlist
    const exists = watchlist.stocks.find(s => s.symbol === symbol);
    if (exists) {
      return res.status(400).json({ error: 'Stock already in watchlist' });
    }
    
    watchlist.stocks.push({ symbol });
    await watchlist.save();
    
    // Fetch stock data for the added stock
    const stockData = await fetchStockData(symbol);
    
    res.json({
      success: true,
      message: 'Stock added to watchlist',
      stock: stockData
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add stock to watchlist' });
  }
};

// Remove stock from watchlist
const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol } = req.params;
    
    const watchlist = await getOrCreateWatchlist(userId);
    
    const initialLength = watchlist.stocks.length;
    watchlist.stocks = watchlist.stocks.filter(s => s.symbol !== symbol);
    
    if (watchlist.stocks.length === initialLength) {
      return res.status(404).json({ error: 'Stock not found in watchlist' });
    }
    
    await watchlist.save();
    
    res.json({
      success: true,
      message: 'Stock removed from watchlist'
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove stock from watchlist' });
  }
};

// Get available stocks (for adding to watchlist)
const getAvailableStocks = async (req, res) => {
  try {
    const allStocks = [
      { symbol: 'RELIANCE.BSE', name: 'Reliance Industries' },
      { symbol: 'TCS.BSE', name: 'Tata Consultancy Services' },
      { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank' },
      { symbol: 'SBIN.BSE', name: 'State Bank of India' },
      { symbol: 'INFY.BSE', name: 'Infosys' },
      { symbol: 'WIPRO.BSE', name: 'Wipro' },
      { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel' },
    ];
    
    // Get user's watchlist to mark which are already added
    const userId = req.user._id;
    const watchlist = await getOrCreateWatchlist(userId);
    const watchedSymbols = watchlist.stocks.map(s => s.symbol);
    
    const stocksWithStatus = allStocks.map(stock => ({
      ...stock,
      inWatchlist: watchedSymbols.includes(stock.symbol)
    }));
    
    res.json({
      success: true,
      stocks: stocksWithStatus
    });
  } catch (error) {
    console.error('Get available stocks error:', error);
    res.status(500).json({ error: 'Failed to fetch available stocks' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getAvailableStocks
};
