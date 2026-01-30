import React, { useState, useEffect } from "react";
import { Star, X, Flame, Trophy, Zap, CheckCircle } from "lucide-react";

// XP Toast Notification Component
const XpToast = ({ xpAmount, message, type = "xp", onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                setIsVisible(false);
                onClose && onClose();
            }, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case "achievement": return <Trophy className="text-yellow-400" size={24} />;
            case "streak": return <Flame className="text-orange-400" size={24} />;
            case "level": return <Zap className="text-purple-400" size={24} />;
            case "success": return <CheckCircle className="text-green-400" size={24} />;
            default: return <Star className="text-yellow-400" size={24} fill="currentColor" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case "achievement": return "from-yellow-600 to-amber-600";
            case "streak": return "from-orange-600 to-red-600";
            case "level": return "from-purple-600 to-pink-600";
            case "success": return "from-green-600 to-emerald-600";
            default: return "from-blue-600 to-purple-600";
        }
    };

    return (
        <div
            className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ease-out
        ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
        >
            <div className={`bg-gradient-to-r ${getBgColor()} rounded-lg shadow-2xl p-4 min-w-[280px] max-w-[350px] border border-white/20`}>
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="bg-white/20 rounded-full p-2 animate-pulse">
                        {getIcon()}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <p className="text-white font-bold text-sm">{message}</p>
                        {xpAmount > 0 && (
                            <p className="text-yellow-200 text-lg font-bold">+{xpAmount} XP</p>
                        )}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setIsExiting(true);
                            setTimeout(() => {
                                setIsVisible(false);
                                onClose && onClose();
                            }, 300);
                        }}
                        className="text-white/60 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toast Container - manages multiple toasts
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-4 z-50 space-y-2">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ transform: `translateY(${index * 10}px)` }}
                >
                    <XpToast
                        xpAmount={toast.xpAmount}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

// Hook to use toasts
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, xpAmount = 0, type = "xp") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, xpAmount, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
};

export default XpToast;
