import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Trophy, Flame, TrendingUp } from "lucide-react";

const LevelBadge = ({ compact = false }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/gamification/stats",
                    { withCredentials: true }
                );
                setStats(response.data.stats);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return null;
    }

    const getLevelColor = (level) => {
        if (level >= 50) return "from-yellow-400 to-amber-500"; // Legend
        if (level >= 30) return "from-purple-500 to-pink-500"; // Master
        if (level >= 20) return "from-blue-500 to-cyan-500"; // Expert
        if (level >= 10) return "from-green-500 to-emerald-500"; // Investor
        if (level >= 5) return "from-orange-400 to-yellow-500"; // Trader
        return "from-gray-400 to-gray-500"; // Rookie
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs font-bold text-purple-700">Lv.{stats.level}</span>
                <span className="text-xs text-purple-600">{stats.xpPoints} XP</span>
                {stats.loginStreak > 0 && (
                    <div className="flex items-center gap-1">
                        <Flame size={12} className="text-orange-500" />
                        <span className="text-xs text-orange-600">{stats.loginStreak}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {/* Level Badge */}
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(stats.level)} flex items-center justify-center shadow-lg`}>
                    <div className="text-white text-center">
                        <div className="text-xs font-medium">LEVEL</div>
                        <div className="text-xl font-bold">{stats.level}</div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">{stats.levelName}</h3>
                    <p className="text-sm text-gray-500">{stats.xpPoints} XP Total</p>
                </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress to Level {stats.level + 1}</span>
                    <span>{stats.xpProgress}/{stats.xpNeeded} XP</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getLevelColor(stats.level)} transition-all duration-500`}
                        style={{ width: `${stats.progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <Flame className="mx-auto text-orange-500" size={20} />
                    <div className="text-lg font-bold text-orange-700">{stats.loginStreak}</div>
                    <div className="text-xs text-orange-600">Day Streak</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <TrendingUp className="mx-auto text-blue-500" size={20} />
                    <div className="text-lg font-bold text-blue-700">{stats.totalTrades}</div>
                    <div className="text-xs text-blue-600">Trades</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                    <Trophy className="mx-auto text-green-500" size={20} />
                    <div className="text-lg font-bold text-green-700">{stats.achievements?.length || 0}</div>
                    <div className="text-xs text-green-600">Badges</div>
                </div>
            </div>

            {/* Achievements */}
            {stats.achievements && stats.achievements.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                        {stats.achievements.map((achievement, i) => (
                            <div
                                key={i}
                                className="bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 flex items-center gap-1"
                                title={achievement.description}
                            >
                                <span>{achievement.icon}</span>
                                <span className="text-xs font-medium text-yellow-800">{achievement.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelBadge;
