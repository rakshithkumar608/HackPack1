import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PopupBox = ({ stockName, orderType, onClose, onConfirm }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("confirm"); // "confirm" -> "reflection" -> "orderDetails"
  const [intention, setIntention] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleConfirm = () => setStep("reflection");

  const handleReflectionNext = () => {
    if (!intention.trim()) {
      alert("Please enter your intention");
      return;
    }
    setStep("orderDetails");
  };

  const handleNo = () => {
    if (onClose) onClose();
    navigate("/dashboard");
  };

  const handleSubmit = () => {
    if (!quantity || !price) {
      alert("Please fill quantity and price");
      return;
    }
    const total = parseInt(quantity) * parseFloat(price);
    onConfirm &&
      onConfirm({
        stockName,
        orderType,
        intention,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        total,
      });
    if (onClose) onClose();
    navigate("/dashboard");
  };

  const total =
    quantity && price ? (parseInt(quantity) * parseFloat(price)).toFixed(2) : 0;

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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3: Order Details */}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">₹{total}</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNo}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded  transition"
              >
                Sell
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-white rounded transition ${
                  orderType === "buy"
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
