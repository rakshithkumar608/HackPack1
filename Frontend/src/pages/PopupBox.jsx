import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PopupBox = ({ stockName, orderType, onClose, onConfirm }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState("confirm");
  const [intention, setIntention] = useState("");
  const [price, setPrice] = useState("");

  const handleConfirm = () => setStep("input");

  const handleNo = () => {
    if (onClose) onClose();
    navigate("/dashboard");
  };

  const handleSubmit = () => {
    if (!intention || !price) {
      alert("Please fill all fields");
      return;
    }
    onConfirm &&
      onConfirm({
        stockName,
        orderType,
        quantity: parseInt(intention),
        price: parseFloat(price),
      });
    if (onClose) onClose();
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
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

        {step === "input" && (
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
                onClick={handleSubmit}
                className={`px-4 py-2 text-white rounded transition ${
                  orderType === "buy"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {orderType === "buy" ? "Submit" : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupBox;
