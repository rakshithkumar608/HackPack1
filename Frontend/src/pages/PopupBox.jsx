import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PopupBox = ({ stockName, orderType, currentPrice, onClose, onConfirm }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("confirm"); // "confirm" -> "reflection" -> "aiResponse" -> "orderDetails"
  const [intention, setIntention] = useState("");
  const [quantity, setQuantity] = useState("");

  // AI Response state
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleConfirm = () => setStep("reflection");

  const handleReflectionNext = async () => {
    if (!intention.trim()) {
      alert("Please enter your intention");
      return;
    }

    setAiLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/pre_trade_check", {
        session_id: "user_session",
        company: stockName,
        user_reasoning: intention
      });

      setAiResponse({
        verdict: res.data.verdict,
        xpAwarded: res.data.xp_awarded,
        judgementMessage: res.data.judgement_message,
        companyNews: res.data.company_news
      });

      setStep("aiResponse");
    } catch (err) {
      console.error(err);
      alert("Reflection analysis failed. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiResponseNext = () => {
    setStep("orderDetails");
  };



  const handleNo = () => {
    if (onClose) onClose();
    navigate("/dashboard");
  };

  const handleSubmit = () => {
    if (!quantity) {
      alert("Please fill quantity");
      return;
    }
    const total = parseInt(quantity) * currentPrice;
    onConfirm &&
      onConfirm({
        stockName,
        orderType,
        intention,
        quantity: parseInt(quantity),
        price: currentPrice,
        total,
      });
    if (onClose) onClose();
    navigate("/dashboard");
  };

  const total =
    quantity ? (parseInt(quantity) * currentPrice).toFixed(2) : 0;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">

        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Intention Box
            </h2>
            <p className="text-gray-600 mb-6">
              Do you want to continue with {stockName}?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNo}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Yes
              </button>
            </div>
          </>
        )}


        {step === "reflection" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Reflection Section
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your Intention
              </label>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Enter your intention in text format"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNo}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReflectionNext}
                disabled={aiLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {aiLoading ? "Analyzing..." : "Next"}
              </button>
            </div>
          </>
        )}

        {step === "aiResponse" && aiResponse && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-xl shadow-2xl w-[420px] overflow-hidden animate-fadeIn">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">AI Trading Advisor</h3>
                  <p className="text-blue-100 text-xs">Analysis Complete</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="p-4 max-h-[400px] overflow-y-auto bg-gray-50">
                {/* User Message Bubble */}
                <div className="flex justify-end mb-3">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
                    <p className="text-sm">{intention}</p>
                  </div>
                </div>

                {/* AI Response Bubble */}
                <div className="flex justify-start mb-3">
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[90%] shadow-sm">
                    {/* Verdict Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${aiResponse.verdict === "good" ? "bg-green-100 text-green-800" :
                        aiResponse.verdict === "risky" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                      }`}>
                      {aiResponse.verdict.toUpperCase()}
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-1 mb-2">
                      <span>⭐</span>
                      <span className="text-sm font-bold text-blue-600">+{aiResponse.xpAwarded} XP earned!</span>
                    </div>

                    {/* Feedback */}
                    <p className="text-sm text-gray-700 mb-3">{aiResponse.judgementMessage}</p>

                    {/* News Section */}
                    <div className="bg-gray-100 rounded-lg p-3 mt-2">
                      <p className="text-xs text-gray-500 font-semibold mb-1">📰 Market News</p>
                      <p className="text-sm text-gray-700">{aiResponse.companyNews}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Footer - Action Buttons */}
              <div className="px-4 py-3 bg-white border-t flex gap-3 justify-end">
                <button
                  onClick={handleNo}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAiResponseNext}
                  className={`px-5 py-2 text-white rounded-lg transition font-semibold ${orderType === "buy"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {orderType === "buy" ? "📈 Proceed to Buy" : "📉 Proceed to Sell"}
                </button>
              </div>
            </div>
          </div>
        )}


        {step === "orderDetails" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Order Details
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Stock: <span className="font-semibold">{stockName}</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per unit
              </label>
              <input
                type="number"
                value={currentPrice}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>

            <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">₹{total}</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNo}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded  transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-white rounded transition ${orderType === "buy"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {orderType === "buy" ? "Buy" : "Sell"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupBox;
