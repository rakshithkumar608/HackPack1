import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, BellIcon, UserCircleIcon, TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { NavLink } from "react-router-dom";

const Portfolio = () => {
    const [portfolioData, setPortfolioData] = useState({
        availableBalance: 0,
        totalInvested: 0,
        holdings: [],
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:5000/api/orders/portfolio",
                    { withCredentials: true }
                );
                setPortfolioData({
                    availableBalance: response.data.availableBalance || 0,
                    totalInvested: response.data.totalInvested || 0,
                    holdings: response.data.holdings || [],
                    recentOrders: response.data.recentOrders || []
                });
            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError(err.response?.data?.message || err.response?.data?.error || "Failed to fetch portfolio");
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, []);

    const { availableBalance, totalInvested, holdings, recentOrders } = portfolioData;
    const totalPortfolioValue = availableBalance + totalInvested;

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                <span className="text-xl font-semibold">
                    <span className="font-bold">Stock</span>
                    <span className="text-blue-600 text-2xl font-bold">Learn</span>
                </span>

                <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
                    <NavLink to="/"><Home size={18} /></NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/portfolio" className="text-blue-600 font-semibold">Portfolio</NavLink>
                    <NavLink to="#">Orders</NavLink>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Available Balance */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet size={20} />
                                <span className="text-green-100 text-sm">Available Balance</span>
                            </div>
                            <p className="text-3xl font-bold">
                                ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Total Invested */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <PieChart size={20} />
                                <span className="text-blue-100 text-sm">Total Invested</span>
                            </div>
                            <p className="text-3xl font-bold">
                                ₹{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Total Portfolio */}
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={20} />
                                <span className="text-purple-100 text-sm">Total Portfolio Value</span>
                            </div>
                            <p className="text-3xl font-bold">
                                ₹{totalPortfolioValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </p>
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
                            <div className="bg-white rounded-lg shadow-md p-5">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Current Holdings</h2>

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
                                        {holdings.map((holding) => (
                                            <div
                                                key={holding.symbol}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
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
                                                            <p className="text-sm text-gray-500">{holding.totalQuantity} shares</p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-800">
                                                            ₹{(holding.netInvested || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Avg: ₹{(holding.avgBuyPrice || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-5">
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
                                                    className={`p-3 rounded-lg border-l-4 ${isBuy
                                                            ? "bg-green-50 border-green-500"
                                                            : "bg-red-50 border-red-500"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {isBuy ? (
                                                                <TrendingUp size={16} className="text-green-600" />
                                                            ) : (
                                                                <TrendingDown size={16} className="text-red-600" />
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
                                                    <div className={`text-sm font-semibold mt-1 ${isBuy ? "text-green-600" : "text-red-600"}`}>
                                                        {isBuy ? "-" : "+"}₹{(order.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
