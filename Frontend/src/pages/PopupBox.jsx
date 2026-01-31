import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PopupBox = ({ stockName, orderType, currentPrice, onClose, onConfirm }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("confirm"); // "confirm" -> "reflection" -> "aiResponse" -> "orderDetails"
  const [intention, setIntention] = useState("");
  const [quantity, setQuantity] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isSound, setIsSound] = useState(false);

  const handleConfirm = () => setStep("reflection");

  const handleReflectionNext = async () => {
    if (!intention.trim()) {
      alert("Please enter your intention");
      return;
    }

    // Call AI chatbot API
    setAiLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          message: intention,
          stockName: stockName,
          orderType: orderType,
          currentPrice: currentPrice
        },
        { withCredentials: true }
      );
      setAiResponse(response.data.response || response.data.message || "No response from AI");
      setIsSound(response.data.isSound || false);
    } catch (error) {
      console.error("AI API error:", error);
      setAiResponse("Unable to get AI advice at the moment. You can still proceed with your order.");
    } finally {
      setAiLoading(false);
    }

    setStep("aiResponse");
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
        {/* Step 1: Intention Box */}
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

        {/* Step 2: Reflection Section */}
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
                {aiLoading ? "Loading..." : "Next"}
              </button>
            </div>
          </>
        )}

        {/* Step 3: AI Chatbot Response */}
        {step === "aiResponse" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                🤖 AI Advisor
              </h2>
              {isSound ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">✓ Sound Reasoning</span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">⚠ Needs Reflection</span>
              )}
            </div>

            <div className={`mb-4 p-4 rounded-lg border max-h-60 overflow-y-auto ${isSound
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
              }`}>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {aiResponse}
              </p>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Your Intention:</p>
              <p className="text-sm text-gray-700 italic">"{intention}"</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNo}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAiResponseNext}
                className={`px-4 py-2 text-white rounded transition ${orderType === "buy"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Proceed to {orderType === "buy" ? "Buy" : "Sell"}
              </button>
            </div>
          </>
        )}

        {/* Step 4: Order Details */}
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
