import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, BellIcon, UserCircleIcon, TrendingUp, TrendingDown } from "lucide-react";
import { NavLink } from "react-router-dom";

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "http://localhost:5000/api/orders/portfolio",
                    {
                        withCredentials: true // Send cookies with request
                    }
                );
                setPortfolio(response.data.portfolio || []);
            } catch (err) {
                console.error("Error fetching portfolio:", err);
                setError(err.response?.data?.message || err.response?.data?.error || "Failed to fetch portfolio");
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    const totalValue = portfolio.reduce(
        (sum, holding) => sum + holding.totalInvested,
        0
    );

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                <span className="text-xl font-semibold">
                    <span className="font-bold">Stock</span>
                    <span className="text-blue-600 text-2xl font-bold">Learn</span>
                </span>

                <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
                    <NavLink to="/">
                        <Home size={18} />
                    </NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/portfolio" className="text-blue-600 font-semibold">
                        Portfolio
                    </NavLink>
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
                    {/* Portfolio Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            My Portfolio
                        </h1>
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Total Invested</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    ₹{totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-sm text-gray-500">Holdings</p>
                                <p className="text-2xl font-semibold text-gray-700">
                                    {portfolio.length}
                                </p>
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

                    {/* Holdings List */}
                    {!loading && !error && portfolio.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg">No holdings yet</p>
                            <p className="text-gray-400 mt-2">
                                Start trading to build your portfolio!
                            </p>
                            <NavLink
                                to="/dashboard"
                                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Go to Dashboard
                            </NavLink>
                        </div>
                    )}

                    {!loading && !error && portfolio.length > 0 && (
                        <div className="grid gap-4">
                            {portfolio.map((holding) => (
                                <div
                                    key={holding.symbol}
                                    className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-sm">
                                                    {holding.symbol.slice(0, 3)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                    {holding.symbol}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {holding.totalQuantity} shares
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-gray-800 text-lg">
                                                ₹{holding.totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Avg: ₹{holding.avgPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order History */}
                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-sm font-medium text-gray-600 mb-2">
                                            Recent Orders
                                        </p>
                                        <div className="space-y-2 max-h-32 overflow-auto">
                                            {holding.orders.slice(0, 3).map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {order.type === "BUY" ? (
                                                            <TrendingUp size={14} className="text-green-600" />
                                                        ) : (
                                                            <TrendingDown size={14} className="text-red-600" />
                                                        )}
                                                        <span
                                                            className={
                                                                order.type === "BUY"
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {order.type}
                                                        </span>
                                                        <span className="text-gray-600">
                                                            {order.quantity} @ ₹{order.price}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-400 text-xs">
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Portfolio;
