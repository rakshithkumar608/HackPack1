import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, BellIcon, UserCircleIcon, TrendingUp, TrendingDown, Wallet, PieChart, Star, Trophy, Flame, Zap, RefreshCw } from "lucide-react";
import { NavLink } from "react-router-dom";
import LevelBadge from "../components/LevelBadge";

const Portfolio = () => {
    const [portfolioData, setPortfolioData] = useState({
        availableBalance: 0,
        totalInvested: 0,
        holdings: [],
        recentOrders: []
    });
    const [xpStats, setXpStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liveData, setLiveData] = useState(null);
    const [loadingLive, setLoadingLive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch portfolio
                const portfolioRes = await axios.get(
                    "http://localhost:5000/api/orders/portfolio",
                    { withCredentials: true }
                );
                setPortfolioData({
                    availableBalance: portfolioRes.data.availableBalance || 0,
                    totalInvested: portfolioRes.data.totalInvested || 0,
                    holdings: portfolioRes.data.holdings || [],
                    recentOrders: portfolioRes.data.recentOrders || []
                });

                // Fetch XP stats
                try {
                    const xpRes = await axios.get(
                        "http://localhost:5000/api/gamification/stats",
                        { withCredentials: true }
                    );
                    setXpStats(xpRes.data.stats);
                } catch (xpErr) {
                    console.error("XP fetch error:", xpErr);
                }

            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError(err.response?.data?.message || err.response?.data?.error || "Failed to fetch portfolio");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Fetch live portfolio values
    const fetchLiveData = async () => {
        try {
            setLoadingLive(true);
            const response = await axios.get(
                "http://localhost:5000/api/orders/portfolio/live",
                { withCredentials: true }
            );
            setLiveData(response.data);
        } catch (err) {
            console.error("Error fetching live data:", err);
            alert("Failed to fetch live prices");
        } finally {
            setLoadingLive(false);
        }
    };

    const { availableBalance, totalInvested, holdings, recentOrders } = portfolioData;
    const totalPortfolioValue = liveData ? liveData.totalPortfolioValue : (availableBalance + totalInvested);

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                <span className="text-xl font-semibold">
                    <span className="font-bold">Stock</span>
                    <span className="text-blue-600 text-2xl font-bold">Learn</span>
                </span>

                <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
                    <NavLink to="/"><Home size={18} /></NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/portfolio" className="text-blue-600 font-semibold">Portfolio</NavLink>
                    <NavLink to="/leaderboard" className="flex items-center gap-1 text-purple-600">
                        <Trophy size={16} /> Leaderboard
                    </NavLink>
                    <button className="relative">
                        <BellIcon size={18} />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>
                    <UserCircleIcon size={28} />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Portfolio Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Available Balance */}
                        <div className="bg-green-400 rounded-lg  p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">

                                <span className="text-green-100 text-xl text-black">Available Balance</span>
                            </div>
                            <p className="text-2xl font-bold">
                                ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Total Invested */}
                        <div className="bg-blue-400 rounded-lg  p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">

                                <span className="text-blue-100 text-xl">Total Invested</span>
                            </div>
                            <p className="text-2xl font-bold">
                                ₹{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Total Portfolio */}
                        <div className="bg-indigo-400 rounded-lg p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">

                                <span className="text-purple-100 text-xl">Portfolio Value</span>
                            </div>
                            <p className="text-2xl font-bold">
                                ₹{totalPortfolioValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* XP Card */}
                        <div className="rounded-lg bg-gray-500 p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">

                                <span className="text-yellow-100 text-xl">Your XP</span>
                            </div>
                            <p className="text-2xl font-bold">
                                {xpStats?.xpPoints || 0} XP
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-yellow-100 text-xs">
                                <span>Level {xpStats?.level || 1}</span>
                                {xpStats?.loginStreak > 0 && (
                                    <span className="flex items-center gap-1">
                                        streak  {xpStats.loginStreak}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Loading/Error States */}
                    {loading && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading portfolio...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                            ❌ {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Holdings */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-200 rounded-lg p-5 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Current Holdings</h2>
                                    <button
                                        onClick={fetchLiveData}
                                        disabled={loadingLive}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <RefreshCw size={14} className={loadingLive ? "animate-spin" : ""} />
                                        {loadingLive ? "Loading..." : "Get Live Values"}
                                    </button>
                                </div>

                                {/* Live Summary Banner */}
                                {liveData && (
                                    <div className={`mb-4 p-3 rounded-lg ${liveData.totalProfitLoss >= 0 ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm text-gray-600">Current Market Value:</span>
                                                <p className="text-xl font-bold text-gray-800">
                                                    ₹{liveData.totalCurrentValue?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm text-gray-600">P&L:</span>
                                                <p className={`text-xl font-bold flex items-center gap-1 ${liveData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {liveData.totalProfitLoss >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                                    {liveData.totalProfitLoss >= 0 ? '+' : ''}₹{liveData.totalProfitLoss?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                    <span className="text-sm">({liveData.totalProfitLoss >= 0 ? '+' : ''}{liveData.totalProfitLossPercent?.toFixed(2)}%)</span>
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Last updated: {new Date(liveData.lastUpdated).toLocaleTimeString()}</p>
                                    </div>
                                )}

                                {!loading && !error && holdings.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No holdings yet</p>
                                        <NavLink
                                            to="/dashboard"
                                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Start Trading
                                        </NavLink>
                                    </div>
                                )}

                                {!loading && !error && holdings.length > 0 && (
                                    <div className="space-y-4">
                                        {(liveData ? liveData.holdings : holdings).map((holding) => {
                                            const hasLive = liveData && holding.currentPrice;
                                            return (
                                                <div
                                                    key={holding.symbol}
                                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-blue-600 font-bold text-sm">
                                                                    {holding.symbol.slice(0, 3)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800">{holding.symbol}</h3>
                                                                <p className="text-sm text-gray-500">{holding.quantity || holding.totalQuantity} shares</p>
                                                            </div>
                                                        </div>

                                                        {hasLive ? (
                                                            <div className="text-right">
                                                                <p className="font-bold text-gray-800">
                                                                    ₹{holding.currentValue?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    LTP: ₹{holding.currentPrice?.toFixed(2)}
                                                                </p>
                                                                <p className={`text-sm font-semibold flex items-center justify-end gap-1 ${holding.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {holding.isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                                    {holding.isProfit ? '+' : ''}₹{holding.profitLoss?.toFixed(2)}
                                                                    ({holding.isProfit ? '+' : ''}{holding.profitLossPercent?.toFixed(2)}%)
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="text-right">
                                                                <p className="font-bold text-gray-800">
                                                                    ₹{(holding.netInvested || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Avg: ₹{(holding.avgBuyPrice || 0).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* XP & Achievements Section */}
                            <div className="bg-white rounded-lg p-5">
                                <h2 className="text-xl ml-1 font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    XP & Achievements
                                </h2>
                                <LevelBadge compact={false} />
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-5">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>

                                {!loading && recentOrders.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No orders yet</p>
                                )}

                                {!loading && recentOrders.length > 0 && (
                                    <div className="space-y-3">
                                        {recentOrders.map((order) => {
                                            const isBuy = order.type === "BUY";
                                            return (
                                                <div
                                                    key={order.id}
                                                    className={`p-3 rounded-lg ${isBuy
                                                        ? "bg-green-50 border-green-500"
                                                        : "bg-red-50 border-red-500"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-black">
                                                            {isBuy ? (
                                                                <TrendingUp size={16} className="text-black" />
                                                            ) : (
                                                                <TrendingDown size={16} className="text-black" />
                                                            )}
                                                            <span className={`font-semibold ${isBuy ? "text-green-700" : "text-red-700"}`}>
                                                                {order.type}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="font-medium text-gray-800">{order.symbol}</span>
                                                        <span className="text-gray-500 text-sm ml-2">
                                                            {order.quantity} @ ₹{order.price?.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className={`text-sm font-semibold ${isBuy ? "text-green-600" : "text-red-600"}`}>
                                                            {isBuy ? "-" : "+"}₹{(order.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                        </span>
                                                        <span className="text-xs text-yellow-600 flex items-center gap-1">
                                                            <Star size={10} /> +{isBuy ? "10" : "15"} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Portfolio;

