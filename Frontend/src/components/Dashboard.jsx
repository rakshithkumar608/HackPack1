import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Home, BellIcon, UserCircleIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import Chart from "../layouts/Chart";
import PopupBox from "../pages/PopupBox";

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

  const chartRef = useRef(null);
  const streamIndexRef = useRef(0);
  const allPricesRef = useRef([]);

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
          `http://localhost:5000/api/trading/GetforRELIANCE/${stockId}`,
        );

        const data = response.data;

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
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleBuyClick = () => {
    setOrderType("buy");
    setShowPopup(true);
  };

  const handleSellClick = () => {
    setOrderType("sell");
    setShowPopup(true);
  };

  const handleOrderConfirm = (orderData) => {
    console.log("Order placed:", orderData);
    // Send to backend or process order here
    alert(
      `${orderData.orderType.toUpperCase()} order placed:\n${orderData.quantity} units of ${orderData.stockName} @ ₹${orderData.price}`,
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <span className="text-xl font-semibold">
          <span className="font-bold">Stock</span>
          <span className="text-blue-600 text-2xl font-bold">Learn</span>
        </span>

        <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <NavLink to="/">
            <Home size={18} />
          </NavLink>

          <NavLink to="#">Watchlist</NavLink>
          <NavLink to="#">Portfolio</NavLink>
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

            <div className="flex gap-3">
              <button
                onClick={handleBuyClick}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Reflection
              </button>
              <button
                onClick={handleSellClick}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
          onClose={() => setShowPopup(false)}
          onConfirm={handleOrderConfirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
