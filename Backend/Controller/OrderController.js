const Order = require('../Schemas/OrderSchema');
const User = require('../Schemas/UserSchema');
const { awardXp, checkAchievements, getOrCreateXpProfile, XP_VALUES } = require('./GamificationController');


const buyOrder = async (req, res) => {
  try {
    const { symbol, orderQuantity, price } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!symbol || !orderQuantity || !price) {
      return res.status(400).json({ message: 'symbol, orderQuantity and price are required' });
    }

    const qty = Number(orderQuantity);
    const pr = Number(price);
    if (!Number.isFinite(qty) || qty <= 0) return res.status(400).json({ message: 'orderQuantity must be a positive number' });
    if (!Number.isFinite(pr) || pr < 0) return res.status(400).json({ message: 'price must be a non-negative number' });

    // Calculate total cost
    const totalCost = qty * pr;

    // Get user (already verified by middleware, but need fresh data for balance)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has sufficient balance
    const currentBalance = user.availableBalance || 0;
    if (currentBalance < totalCost) {
      return res.status(400).json({ 
        message: 'Insufficient balance',
        required: totalCost,
        available: currentBalance
      });
    }

    // Create order document
    const order = new Order({
      userId: user._id,
      orderQuantity: qty,
      symbol: String(symbol).trim().toUpperCase(),
      price: pr,
      orderType: 'BUY',
      totalAmount: totalCost
    });

    await order.save();

    // Deduct balance and push order reference to user's orders array
    user.availableBalance = currentBalance - totalCost;
    user.orders = user.orders || [];
    user.orders.push(order._id);
    await user.save();

    // Award XP for buy order
    let xpAwarded = XP_VALUES.BUY_ORDER;
    try {
      const xpProfile = await getOrCreateXpProfile(userId);
      xpProfile.xpPoints += xpAwarded;
      xpProfile.totalTrades += 1;
      xpProfile.behavior_history.push(`+${xpAwarded} XP: Buy order ${symbol}`);
      await xpProfile.save();
      await checkAchievements(userId);
    } catch (xpErr) {
      console.error('XP error:', xpErr);
    }

    return res.status(201).json({ 
      message: 'Buy order created', 
      order,
      newBalance: user.availableBalance,
      xpAwarded
    });
  } catch (err) {
    console.error('buyOrder error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

const sellOrder = async (req, res) => {
  try {
    const { symbol, orderQuantity, price } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!symbol || !orderQuantity || !price) {
      return res.status(400).json({ message: 'symbol, orderQuantity and price are required' });
    }

    const qty = Number(orderQuantity);
    const pr = Number(price);
    const symbolUpper = String(symbol).trim().toUpperCase();

    if (!Number.isFinite(qty) || qty <= 0) return res.status(400).json({ message: 'orderQuantity must be a positive number' });
    if (!Number.isFinite(pr) || pr < 0) return res.status(400).json({ message: 'price must be a non-negative number' });

    // Get user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Calculate how many shares the user owns of this symbol and avg buy price
    const userOrders = await Order.find({ userId, symbol: symbolUpper });
    let ownedQuantity = 0;
    let totalBuyAmount = 0;
    let totalBuyQty = 0;
    
    userOrders.forEach(order => {
      if (order.orderType === 'BUY') {
        ownedQuantity += order.orderQuantity;
        totalBuyAmount += order.totalAmount;
        totalBuyQty += order.orderQuantity;
      } else if (order.orderType === 'SELL') {
        ownedQuantity -= order.orderQuantity;
      }
    });

    // Check if user owns enough shares to sell
    if (ownedQuantity < qty) {
      return res.status(400).json({ 
        message: 'Insufficient shares to sell',
        requested: qty,
        owned: ownedQuantity
      });
    }

    // Calculate average buy price and profit
    const avgBuyPrice = totalBuyQty > 0 ? totalBuyAmount / totalBuyQty : 0;
    const isProfitable = pr > avgBuyPrice;

    // Calculate sale value
    const saleValue = qty * pr;

    // Create sell order document
    const order = new Order({
      userId: user._id,
      orderQuantity: qty,
      symbol: symbolUpper,
      price: pr,
      orderType: 'SELL',
      totalAmount: saleValue
    });

    await order.save();

    // Add sale value to balance and push order reference
    const currentBalance = user.availableBalance || 0;
    user.availableBalance = currentBalance + saleValue;
    user.orders = user.orders || [];
    user.orders.push(order._id);
    await user.save();

    // Award XP for sell order
    let xpAwarded = XP_VALUES.SELL_ORDER;
    if (isProfitable) {
      xpAwarded += XP_VALUES.PROFITABLE_TRADE;
    }
    
    try {
      const xpProfile = await getOrCreateXpProfile(userId);
      xpProfile.xpPoints += xpAwarded;
      xpProfile.totalTrades += 1;
      if (isProfitable) {
        xpProfile.profitableTrades += 1;
      }
      xpProfile.behavior_history.push(`+${xpAwarded} XP: Sell order ${symbol}${isProfitable ? ' (profit!)' : ''}`);
      await xpProfile.save();
      await checkAchievements(userId);
    } catch (xpErr) {
      console.error('XP error:', xpErr);
    }

    return res.status(201).json({ 
      message: 'Sell order created', 
      order,
      newBalance: user.availableBalance,
      xpAwarded,
      isProfitable
    });
  } catch (err) {
    console.error('sellOrder error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      availableBalance: user.availableBalance || 100000,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error('getBalance error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

const getHolding = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    const symbolUpper = String(symbol).trim().toUpperCase();
    
    // Get all orders for this symbol
    const orders = await Order.find({ userId, symbol: symbolUpper });
    
    // Calculate net quantity owned
    let ownedQuantity = 0;
    let totalInvested = 0;
    
    orders.forEach(order => {
      if (order.orderType === 'BUY') {
        ownedQuantity += order.orderQuantity;
        totalInvested += order.totalAmount || (order.orderQuantity * order.price);
      } else if (order.orderType === 'SELL') {
        ownedQuantity -= order.orderQuantity;
        totalInvested -= order.totalAmount || (order.orderQuantity * order.price);
      }
    });

    const avgPrice = ownedQuantity > 0 ? totalInvested / ownedQuantity : 0;

    return res.status(200).json({
      symbol: symbolUpper,
      ownedQuantity,
      totalInvested,
      avgPrice
    });
  } catch (err) {
    console.error('getHolding error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware

    // Get user for balance
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get all orders for the user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // Aggregate holdings by symbol
    const holdings = {};
    let totalInvestedOverall = 0;

    orders.forEach(order => {
      if (!holdings[order.symbol]) {
        holdings[order.symbol] = {
          symbol: order.symbol,
          totalQuantity: 0,
          totalBuyAmount: 0,
          totalSellAmount: 0,
          avgBuyPrice: 0,
          buyCount: 0,
          orders: []
        };
      }

      if (order.orderType === 'BUY') {
        holdings[order.symbol].totalQuantity += order.orderQuantity;
        holdings[order.symbol].totalBuyAmount += order.totalAmount;
        holdings[order.symbol].buyCount += order.orderQuantity;
      } else if (order.orderType === 'SELL') {
        holdings[order.symbol].totalQuantity -= order.orderQuantity;
        holdings[order.symbol].totalSellAmount += order.totalAmount;
      }

      holdings[order.symbol].orders.push({
        id: order._id,
        type: order.orderType,
        quantity: order.orderQuantity,
        price: order.price,
        total: order.totalAmount,
        date: order.createdAt
      });
    });

    // Calculate average buy price and current investment for each holding
    Object.values(holdings).forEach(holding => {
      if (holding.buyCount > 0) {
        holding.avgBuyPrice = holding.totalBuyAmount / holding.buyCount;
      }
      // Net invested = total bought - total sold
      holding.netInvested = holding.totalBuyAmount - holding.totalSellAmount;
      if (holding.totalQuantity > 0) {
        totalInvestedOverall += holding.netInvested;
      }
    });

    // Convert to array and filter out zero holdings for current holdings
    const currentHoldings = Object.values(holdings).filter(h => h.totalQuantity > 0);

    // Get recent orders (last 10)
    const recentOrders = orders.slice(0, 10).map(order => ({
      id: order._id,
      symbol: order.symbol,
      type: order.orderType,
      quantity: order.orderQuantity,
      price: order.price,
      total: order.totalAmount,
      date: order.createdAt
    }));

    return res.status(200).json({
      message: 'Portfolio fetched successfully',
      availableBalance: user.availableBalance || 100000,
      totalInvested: totalInvestedOverall,
      holdings: currentHoldings,
      recentOrders: recentOrders,
      totalOrderCount: orders.length
    });
  } catch (err) {
    console.error('getPortfolio error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

// Mock current prices (same as WatchlistController)
const getMockPrice = (symbol) => {
  const mockPrices = {
    'RELIANCE.BSE': 2450.50 + (Math.random() - 0.5) * 100,
    'TCS.BSE': 3890.25 + (Math.random() - 0.5) * 150,
    'HDFCBANK.BSE': 1650.80 + (Math.random() - 0.5) * 80,
    'ICICIBANK.BSE': 1125.60 + (Math.random() - 0.5) * 50,
    'SBIN.BSE': 785.40 + (Math.random() - 0.5) * 40,
    'INFY.BSE': 1580.00 + (Math.random() - 0.5) * 70,
    'WIPRO.BSE': 425.30 + (Math.random() - 0.5) * 20,
    'BHARTIARTL.BSE': 1450.75 + (Math.random() - 0.5) * 60,
  };
  return mockPrices[symbol] || 1000 + Math.random() * 500;
};

// Get live portfolio valuation with current market prices
const getLivePortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get all orders for this user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // Build holdings map
    const holdings = {};
    orders.forEach(order => {
      if (!holdings[order.symbol]) {
        holdings[order.symbol] = {
          symbol: order.symbol,
          totalQuantity: 0,
          totalBuyAmount: 0,
          buyCount: 0,
          avgBuyPrice: 0
        };
      }

      const h = holdings[order.symbol];
      if (order.orderType === 'BUY') {
        h.totalQuantity += order.orderQuantity;
        h.totalBuyAmount += order.totalAmount;
        h.buyCount += order.orderQuantity;
      } else if (order.orderType === 'SELL') {
        h.totalQuantity -= order.orderQuantity;
      }
    });

    // Calculate current values for holdings with quantity > 0
    const liveHoldings = [];
    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalProfitLoss = 0;

    Object.values(holdings).forEach(h => {
      if (h.totalQuantity > 0) {
        // Calculate average buy price
        h.avgBuyPrice = h.buyCount > 0 ? h.totalBuyAmount / h.buyCount : 0;
        
        // Get current market price
        const currentPrice = getMockPrice(h.symbol);
        
        // Calculate values
        const invested = h.avgBuyPrice * h.totalQuantity;
        const currentValue = currentPrice * h.totalQuantity;
        const profitLoss = currentValue - invested;
        const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;

        liveHoldings.push({
          symbol: h.symbol,
          quantity: h.totalQuantity,
          avgBuyPrice: h.avgBuyPrice,
          currentPrice: currentPrice,
          invested: invested,
          currentValue: currentValue,
          profitLoss: profitLoss,
          profitLossPercent: profitLossPercent,
          isProfit: profitLoss >= 0
        });

        totalInvested += invested;
        totalCurrentValue += currentValue;
        totalProfitLoss += profitLoss;
      }
    });

    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    return res.status(200).json({
      success: true,
      availableBalance: user.availableBalance || 100000,
      totalInvested: totalInvested,
      totalCurrentValue: totalCurrentValue,
      totalProfitLoss: totalProfitLoss,
      totalProfitLossPercent: totalProfitLossPercent,
      totalPortfolioValue: (user.availableBalance || 100000) + totalCurrentValue,
      holdings: liveHoldings,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.error('getLivePortfolio error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

module.exports = {
  buyOrder,
  sellOrder,
  getBalance,
  getHolding,
  getPortfolio,
  getLivePortfolio,
};
