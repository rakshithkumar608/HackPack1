import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Home,
    BellIcon,
    UserCircleIcon,
    Trophy,
    Star,
    Plus,
    Trash2,
    TrendingUp,
    TrendingDown,
    Eye,
    Search,
    X,
    RefreshCw
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Watchlist = () => {
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState([]);
    const [availableStocks, setAvailableStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Fetch watchlist
    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/watchlist",
                { withCredentials: true }
            );
            setWatchlist(response.data.watchlist || []);
        } catch (err) {
            console.error("Error fetching watchlist:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch available stocks
    const fetchAvailableStocks = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/watchlist/available",
                { withCredentials: true }
            );
            setAvailableStocks(response.data.stocks || []);
        } catch (err) {
            console.error("Error fetching available stocks:", err);
        }
    };

    useEffect(() => {
        fetchWatchlist();
        fetchAvailableStocks();
    }, []);

    // Add stock to watchlist
    const handleAddStock = async (symbol) => {
        try {
            await axios.post(
                "http://localhost:5000/api/watchlist/add",
                { symbol },
                { withCredentials: true }
            );
            setShowAddModal(false);
            fetchWatchlist();
            fetchAvailableStocks();
        } catch (err) {
            console.error("Error adding stock:", err);
            alert(err.response?.data?.error || "Failed to add stock");
        }
    };

    // Remove stock from watchlist
    const handleRemoveStock = async (symbol) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/watchlist/remove/${symbol}`,
                { withCredentials: true }
            );
            fetchWatchlist();
            fetchAvailableStocks();
        } catch (err) {
            console.error("Error removing stock:", err);
        }
    };

    // Refresh stock data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchWatchlist();
        setRefreshing(false);
    };

    // Navigate to dashboard with selected stock
    const handleStockClick = (symbol) => {
        // Store selected stock and navigate
        localStorage.setItem("selectedStock", symbol);
        navigate("/dashboard");
    };

    // Filter stocks for search
    const filteredStocks = availableStocks.filter(
        (stock) =>
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <NavLink to="/portfolio">Portfolio</NavLink>
                    <NavLink to="/watchlist" className="text-blue-600 font-semibold flex items-center gap-1">
                        <Eye size={16} /> Watchlist
                    </NavLink>
                    <NavLink to="/leaderboard" className="flex items-center gap-1">
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
                <div className="max-w-5xl mx-auto">
                    {/* Title & Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Eye className="text-blue-600" /> My Watchlist
                            </h1>
                            <p className="text-gray-500 text-sm">Track your favorite stocks</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                                Refresh
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Plus size={16} />
                                Add Stock
                            </button>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading watchlist...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && watchlist.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Eye size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your watchlist is empty</h3>
                            <p className="text-gray-500 mb-6">Add stocks to track their prices and performance</p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Add Your First Stock
                            </button>
                        </div>
                    )}

                    {/* Watchlist Table */}
                    {!loading && watchlist.length > 0 && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">LTP</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Change</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Day High</th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Day Low</th>
                                        <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {watchlist.map((stock, index) => {
                                        const isPositive = stock.change >= 0;
                                        return (
                                            <tr
                                                key={stock.symbol}
                                                className={`border-b hover:bg-gray-50 cursor-pointer transition ${index % 2 === 0 ? "bg-white" : "bg-gray-25"
                                                    }`}
                                                onClick={() => handleStockClick(stock.symbol)}
                                            >
                                                {/* Stock Symbol */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-blue-600 font-bold text-sm">
                                                                {stock.symbol.slice(0, 3)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{stock.symbol.replace('.BSE', '')}</h4>
                                                            <p className="text-xs text-gray-500">BSE</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* LTP */}
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-gray-800 text-lg">
                                                        ₹{stock.price?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>

                                                {/* Change */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className={`flex items-center justify-end gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                        <span className="font-semibold">
                                                            {isPositive ? "+" : ""}{stock.change?.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm">
                                                            ({isPositive ? "+" : ""}{stock.changePercent?.toFixed(2)}%)
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Day High */}
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-green-700 font-medium">
                                                        ₹{stock.high?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>

                                                {/* Day Low */}
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-red-700 font-medium">
                                                        ₹{stock.low?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => handleStockClick(stock.symbol)}
                                                            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                                                        >
                                                            Buy
                                                        </button>
                                                        <button
                                                            onClick={() => handleStockClick(stock.symbol)}
                                                            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                                        >
                                                            Sell
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveStock(stock.symbol)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Stock Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Add to Watchlist</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search stocks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Stock List */}
                        <div className="max-h-80 overflow-y-auto p-2">
                            {filteredStocks.map((stock) => (
                                <div
                                    key={stock.symbol}
                                    className={`flex items-center justify-between p-3 rounded-lg ${stock.inWatchlist ? "bg-gray-100" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{stock.symbol.replace('.BSE', '')}</h4>
                                        <p className="text-sm text-gray-500">{stock.name}</p>
                                    </div>
                                    {stock.inWatchlist ? (
                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                            <Star size={14} fill="currentColor" /> Added
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleAddStock(stock.symbol)}
                                            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Watchlist;
