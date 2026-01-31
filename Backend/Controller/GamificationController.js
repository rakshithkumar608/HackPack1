const Xp = require('../Schemas/XpSchema');
const User = require('../Schemas/UserSchema');
const Order = require('../Schemas/OrderSchema');

const XP_VALUES = {
  LOGIN: 10,
  LOGIN_STREAK_BONUS: 5, 
  BUY_ORDER: 10,
  SELL_ORDER: 15,
  PROFITABLE_TRADE: 25,
  FIRST_TRADE_OF_DAY: 20
};

const ACHIEVEMENTS = {
  FIRST_TRADE: {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Complete your first order',
    icon: '🥇',
    check: (stats) => stats.totalTrades >= 1
  },
  TRADER_5: {
    id: 'trader_5',
    name: 'Active Trader',
    description: 'Complete 5 trades',
    icon: '📊',
    check: (stats) => stats.totalTrades >= 5
  },
  TRADER_25: {
    id: 'trader_25',
    name: 'Pro Trader',
    description: 'Complete 25 trades',
    icon: '💼',
    check: (stats) => stats.totalTrades >= 25
  },
  BULL_RUN: {
    id: 'bull_run',
    name: 'Bull Run',
    description: 'Make 5 profitable trades',
    icon: '📈',
    check: (stats) => stats.profitableTrades >= 5
  },
  STREAK_3: {
    id: 'streak_3',
    name: 'On Fire',
    description: '3-day login streak',
    icon: '🔥',
    check: (stats) => stats.loginStreak >= 3
  },
  STREAK_7: {
    id: 'streak_7',
    name: 'Dedicated',
    description: '7-day login streak',
    icon: '⭐',
    check: (stats) => stats.loginStreak >= 7
  },
  DIVERSIFIED: {
    id: 'diversified',
    name: 'Diversified',
    description: 'Own 3+ different stocks',
    icon: '🏦',
    check: (stats) => stats.uniqueStocks >= 3
  },
  BIG_SPENDER: {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Invest ₹10,000+ in one trade',
    icon: '💰',
    check: (stats) => stats.maxTradeAmount >= 10000
  },
  LEVEL_5: {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '🌟',
    check: (stats) => stats.level >= 5
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Investor',
    description: 'Reach Level 10',
    icon: '👑',
    check: (stats) => stats.level >= 10
  }
};

const getOrCreateXpProfile = async (userId) => {
  let xpProfile = await Xp.findOne({ userId });
  
  if (!xpProfile) {
    xpProfile = new Xp({ userId });
    await xpProfile.save();
    
    await User.findByIdAndUpdate(userId, { xpProfile: xpProfile._id });
  }
  
  return xpProfile;
};

const awardXp = async (userId, amount, reason) => {
  const xpProfile = await getOrCreateXpProfile(userId);
  xpProfile.xpPoints += amount;
  xpProfile.behavior_history.push(`+${amount} XP: ${reason} at ${new Date().toISOString()}`);
  await xpProfile.save();
  return xpProfile;
};

const handleLoginXp = async (userId) => {
  const xpProfile = await getOrCreateXpProfile(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastLogin = xpProfile.lastLoginDate;
  let xpAwarded = 0;
  
  if (!lastLogin || lastLogin < today) {
    xpAwarded += XP_VALUES.LOGIN;
    
    if (lastLogin) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin >= yesterday) {
        xpProfile.loginStreak += 1;
        xpAwarded += XP_VALUES.LOGIN_STREAK_BONUS * Math.min(xpProfile.loginStreak, 7);
      } else {
        xpProfile.loginStreak = 1;
      }
    } else {
      xpProfile.loginStreak = 1;
    }
    
    xpProfile.xpPoints += xpAwarded;
    xpProfile.lastLoginDate = new Date();
    xpProfile.behavior_history.push(`+${xpAwarded} XP: Daily login (streak: ${xpProfile.loginStreak})`);
    await xpProfile.save();
    
    await checkAchievements(userId);
  }
  
  return { xpAwarded, streak: xpProfile.loginStreak, totalXp: xpProfile.xpPoints };
};

const checkAchievements = async (userId) => {
  const xpProfile = await getOrCreateXpProfile(userId);
  const user = await User.findById(userId);
  
  const orders = await Order.find({ userId });
  const uniqueStocks = new Set(orders.map(o => o.symbol)).size;
  const maxTradeAmount = orders.length > 0 ? Math.max(...orders.map(o => o.totalAmount)) : 0;
  
  const stats = {
    totalTrades: xpProfile.totalTrades,
    profitableTrades: xpProfile.profitableTrades,
    loginStreak: xpProfile.loginStreak,
    uniqueStocks,
    maxTradeAmount,
    level: xpProfile.level
  };
  
  const newAchievements = [];
  const existingIds = xpProfile.achievements.map(a => a.id);
  
  for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
    if (!existingIds.includes(achievement.id) && achievement.check(stats)) {
      const newAchievement = {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: new Date()
      };
      xpProfile.achievements.push(newAchievement);
      newAchievements.push(newAchievement);
      
      xpProfile.xpPoints += 50;
      xpProfile.behavior_history.push(`+50 XP: Unlocked achievement "${achievement.name}"`);
    }
  }
  
  if (newAchievements.length > 0) {
    await xpProfile.save();
  }
  
  return newAchievements;
};

const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const xpProfile = await getOrCreateXpProfile(userId);
    const user = await User.findById(userId);
    
    const orders = await Order.find({ userId });
    const uniqueStocks = new Set(orders.map(o => o.symbol)).size;
    
    const currentLevelXp = (xpProfile.level - 1) * 100;
    const nextLevelXp = xpProfile.level * 100;
    const xpProgress = xpProfile.xpPoints - currentLevelXp;
    const xpNeeded = nextLevelXp - currentLevelXp;
    
    return res.status(200).json({
      success: true,
      stats: {
        xpPoints: xpProfile.xpPoints,
        level: xpProfile.level,
        levelName: xpProfile.getLevelName(),
        xpProgress,
        xpNeeded,
        progressPercent: Math.round((xpProgress / xpNeeded) * 100),
        loginStreak: xpProfile.loginStreak,
        totalTrades: xpProfile.totalTrades,
        profitableTrades: xpProfile.profitableTrades,
        achievements: xpProfile.achievements,
        uniqueStocks,
        availableBalance: user.availableBalance
      }
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Xp.find()
      .sort({ xpPoints: -1 })
      .limit(10)
      .populate('userId', 'name');
    
    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      name: entry.userId?.name || 'Anonymous',
      xpPoints: entry.xpPoints,
      level: entry.level,
      levelName: entry.getLevelName(),
      achievements: entry.achievements.length
    }));
    
    let userRank = null;
    if (req.user) {
      const userXp = await Xp.findOne({ userId: req.user._id });
      if (userXp) {
        const higherCount = await Xp.countDocuments({ xpPoints: { $gt: userXp.xpPoints } });
        userRank = higherCount + 1;
      }
    }
    
    return res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard,
      userRank
    });
  } catch (err) {
    console.error('getLeaderboard error:', err);
    return res.status(500).json({ message: 'Server error', details: err.message });
  }
};

module.exports = {
  getOrCreateXpProfile,
  awardXp,
  handleLoginXp,
  checkAchievements,
  getStats,
  getLeaderboard,
  XP_VALUES
};
