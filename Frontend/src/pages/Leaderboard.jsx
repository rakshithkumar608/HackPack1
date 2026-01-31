import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, BellIcon, UserCircleIcon, Trophy, Medal, Crown, Star } from "lucide-react";
import { NavLink } from "react-router-dom";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/gamification/leaderboard",
                    { withCredentials: true }
                );
                setLeaderboard(response.data.leaderboard || []);
                setUserRank(response.data.userRank);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="text-yellow-500" size={24} />;
            case 2: return <Medal className="text-gray-400" size={24} />;
            case 3: return <Medal className="text-amber-600" size={24} />;
            default: return <span className="text-gray-500 font-bold">#{rank}</span>;
        }
    };

    const getRankBg = (rank) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300";
            case 2: return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300";
            case 3: return "bg-gradient-to-r from-orange-50 to-amber-50 border-amber-300";
            default: return "bg-white border-gray-200";
        }
    };

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
                    <NavLink to="/portfolio">Portfolio</NavLink>
                    <NavLink to="/leaderboard" className="text-purple-600 font-semibold flex items-center gap-1">
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
                <div className="max-w-3xl mx-auto">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center gap-3 text-black px-6 py-3 rounded-full mb-4">
                            <Trophy size={28} />
                            <h1 className="text-2xl font-bold">Leaderboard</h1>
                        </div>
                        {userRank && (
                            <p className="text-gray-600">Your Rank: <span className="font-bold text-green-600">#{userRank}</span></p>
                        )}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2  mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
                        </div>
                    )}

                    {/* Leaderboard List */}
                    {!loading && leaderboard.length > 0 && (
                        <div className="space-y-3">
                            {leaderboard.map((player) => (
                                <div
                                    key={player.rank}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${getRankBg(player.rank)} transition hover:shadow-lg`}
                                >
                                    {/* Rank */}
                                    <div className="w-12 text-center">
                                        {getRankIcon(player.rank)}
                                    </div>

                                    {/* Avatar & Name */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 text-lg">{player.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="bg-gray-200 text-black px-2 py-0.5 rounded-full text-xs font-medium">
                                                {player.levelName}
                                            </span>
                                            <span>Level {player.level}</span>
                                            <span>•</span>
                                            <span>{player.achievements} badges</span>
                                        </div>
                                    </div>

                                    {/* XP */}
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-orange-300">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-bold text-lg">{player.xpPoints.toLocaleString()}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && leaderboard.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
                            <p>No players yet. Be the first!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;
