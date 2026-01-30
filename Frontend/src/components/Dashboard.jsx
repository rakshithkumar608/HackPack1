import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Home, BellIcon, UserCircleIcon, Trophy } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import Chart from "../layouts/Chart";
import PopupBox from "../pages/PopupBox";
import LevelBadge from "./LevelBadge";

const STOCK_IDS = {
  "RELIANCE.BSE": "697cba312f464eddee194a8c",
  "TCS.BSE": "697cbbc0c4c03242cb8ec328",
  "HDFCBANK.BSE": "697cbbe4d2dccf79df8f924f",
  "ICICIBANK.BSE": "697cbc1c92a7f59650aca36a",
  "SBIN.BSE": "697cbc41c29e289a7bd24e48",
};

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState("RELIANCE.BSE");
  const [showPopup, setShowPopup] = useState(false);
  const [orderType, setOrderType] = useState(null); // "buy" or "sell"
  const [availableBalance, setAvailableBalance] = useState(0);
  const [ownedShares, setOwnedShares] = useState(0);
  const [avgBuyPrice, setAvgBuyPrice] = useState(0);

  const chartRef = useRef(null);
  const streamIndexRef = useRef(0);
  const allPricesRef = useRef([]);

  // Fetch user balance
  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders/balance",
        { withCredentials: true }
      );
      setAvailableBalance(response.data.availableBalance || 0);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Fetch shares owned for selected stock
  const fetchHolding = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/holding/${selectedStock}`,
        { withCredentials: true }
      );
      setOwnedShares(response.data.ownedQuantity || 0);
      setAvgBuyPrice(response.data.avgPrice || 0);
    } catch (err) {
      console.error("Error fetching holding:", err);
      setOwnedShares(0);
      setAvgBuyPrice(0);
    }
  };

  useEffect(() => {
    fetchHolding();
  }, [selectedStock]);

  useEffect(() => {
    const stockId = STOCK_IDS[selectedStock];
    if (!stockId) {
      setError("Stock ID not found");
      setChartData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `http://localhost:5000/api/trading/GetforRELIANCE/${stockId}`
        );

        const data = response.data;
        console.log("The Data is:", data)

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid data format from backend");
        }

        const formatted = [];
        let timeCounter = 1642425322;

        data.forEach((dayPrices) => {
          if (Array.isArray(dayPrices)) {
            dayPrices.forEach((price) => {
              const numPrice = Number(price);
              if (!isNaN(numPrice)) {
                formatted.push({
                  time: timeCounter,
                  value: numPrice,
                });
                timeCounter += 3600;
              }
            });
          }
        });

        if (formatted.length === 0) {
          throw new Error("No valid data points extracted");
        }

        allPricesRef.current = formatted;
        const initialData = formatted.slice(0, 10);
        setChartData(initialData);
        streamIndexRef.current = 10;
      } catch (err) {
        if (err.response) {
          setError(`Server error: ${err.response.status}`);
        } else if (err.request) {
          setError("Backend not reachable");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStock]);

  // Stream data
  useEffect(() => {
    if (allPricesRef.current.length === 0 || loading) return;

    const interval = setInterval(() => {
      if (streamIndexRef.current < allPricesRef.current.length) {
        const nextPoint = allPricesRef.current[streamIndexRef.current];

        if (chartRef.current) {
          chartRef.current.addPrice({
            time: nextPoint.time,
            value: nextPoint.value,
          });
        }

        streamIndexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [loading]);

  const [currentPrice, setCurrentPrice] = useState(0);

  const handleBuyClick = () => {
    const livePrice = chartRef.current?.getCurrentPrice() || 0;
    setCurrentPrice(livePrice);
    setOrderType("buy");
    setShowPopup(true);
  };

  const handleSellClick = () => {
    const livePrice = chartRef.current?.getCurrentPrice() || 0;
    setCurrentPrice(livePrice);
    setOrderType("sell");
    setShowPopup(true);
  };

  const handleOrderConfirm = async (orderData) => {
    console.log("Order data:", orderData);

    // Determine endpoint based on order type
    const endpoint = orderData.orderType === "sell"
      ? "http://localhost:5000/api/orders/sell"
      : "http://localhost:5000/api/orders/buy";

    try {
      const response = await axios.post(
        endpoint,
        {
          symbol: orderData.stockName,
          orderQuantity: orderData.quantity,
          price: orderData.price
        },
        {
          withCredentials: true // Send cookies with request
        }
      );

      alert(
        `✅ ${orderData.orderType.toUpperCase()} order placed!\n${orderData.quantity} units of ${orderData.stockName} @ ₹${orderData.price}\nNew Balance: ₹${response.data.newBalance?.toLocaleString("en-IN") || "N/A"}`
      );

      // Refresh balance and holdings after order
      fetchBalance();
      fetchHolding();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to place order";
      const available = error.response?.data?.available;
      const required = error.response?.data?.required;
      const owned = error.response?.data?.owned;
      const requested = error.response?.data?.requested;

      if (owned !== undefined) {
        alert(`❌ ${errorMsg}\nRequested: ${requested} shares\nOwned: ${owned} shares`);
      } else if (available !== undefined) {
        alert(`❌ ${errorMsg}\nRequired: ₹${required?.toLocaleString("en-IN")}\nAvailable: ₹${available?.toLocaleString("en-IN")}`);
      } else {
        alert(`❌ ${errorMsg}`);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <span className="text-xl font-semibold">
          <span className="font-bold">Stock</span>
          <span className="text-blue-600 text-2xl font-bold">Learn</span>
        </span>

        <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
          {/* Level Badge */}
          <LevelBadge compact={true} />

          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-semibold">
            ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>

          <NavLink to="/">
            <Home size={18} />
          </NavLink>

          <NavLink to="#">Watchlist</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="#">Orders</NavLink>

          <button className="relative">
            <BellIcon size={18} />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <UserCircleIcon size={28} />
        </div>
      </header>

      <div className="flex flex-1 bg-gray-100">
        <Sidebar
          className="hidden md:block"
          onStockSelect={(name) => setSelectedStock(name)}
          selected={selectedStock}
        />

        <main className="flex-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-700">
                Market Overview
              </h1>

              <div className="text-2xl text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                {selectedStock}
              </div>
            </div>

            {/* Holdings & Balance Info Panel */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-600 font-medium">You Own</div>
                <div className="text-lg font-bold text-blue-800">
                  {ownedShares} shares
                </div>
                {avgBuyPrice > 0 && (
                  <div className="text-xs text-blue-500">
                    Avg: ₹{avgBuyPrice.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="text-xs text-green-600 font-medium">Available</div>
                <div className="text-lg font-bold text-green-800">
                  ₹{availableBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="flex gap-3">

              <button
                onClick={handleBuyClick}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Buy
              </button>
              <button
                onClick={handleSellClick}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sell
              </button>
            </div>
          </div>

          <div className="flex-1">
            {loading && <div>Loading chart...</div>}
            {error && <div className="text-red-600">❌ {error}</div>}
            {!loading && !error && chartData.length > 0 && (
              <>
                <div className="text-sm text-gray-600 mb-2">
                  📊 Live Streaming: {streamIndexRef.current} /{" "}
                  {allPricesRef.current.length} points
                </div>
                <Chart ref={chartRef} data={chartData} />
              </>
            )}
            {!loading && !error && chartData.length === 0 && (
              <div>No data available</div>
            )}
          </div>
        </main>
      </div>

      {/* Popup */}
      {showPopup && (
        <PopupBox
          stockName={selectedStock}
          orderType={orderType}
          currentPrice={currentPrice}
          onClose={() => setShowPopup(false)}
          onConfirm={handleOrderConfirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
