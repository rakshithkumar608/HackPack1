


require('dotenv').config();
const mongoose = require('mongoose');
const TradingData = require('../Schemas/TradingDataSchema.js');

// Helper: extract numeric high/low from various stored shapes
const extractHighLow = (data) => {
  if (!data || typeof data !== "object") return null;

  // EXACT structure from your MongoDB
  const highRaw = data["2"]?.[" high"];
  const lowRaw  = data["3"]?.[" low"];

  if (highRaw === undefined || lowRaw === undefined) {
    console.warn("❌ Missing high/low keys:", data);
    return null;
  }

  const high = parseFloat(highRaw);
  const low  = parseFloat(lowRaw);

  if (Number.isNaN(high) || Number.isNaN(low)) {
    console.warn("❌ NaN high/low:", highRaw, lowRaw);
    return null;
  }

  return { high, low };
};


const generateRandomValues = (low, high, count = 50) => {
  const arr = [];
  for (let i = 0; i < count; i++) {
    const v = Math.random() * (high - low) + low;
    arr.push(Number(v.toFixed(4)));
  }
  // console.log(arr)
  return arr;
};

// main fun

const RELIANCE = async (req, res) => {
   console.log("Triggerd")
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'id param required' });

    // Check if already connected; if not, connect
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const stock = await TradingData.findById(new mongoose.Types.ObjectId(id));

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
     console.log("stock is available")

    // convert Map to plain object if needed
    const timeSeries = stock.timeSeries instanceof Map ? Object.fromEntries(stock.timeSeries) : stock.timeSeries;
    console.log('📊 timeSeries keys:', Object.keys(timeSeries).slice(0, 3), '...');

    const simulatedData = Object.entries(timeSeries).map(([date, data]) => {
      const hl = extractHighLow(data);
      if (!hl) {
        console.log(`⚠️ Date ${date}: extractHighLow returned null`);
        return Array(50).fill(null);
      }
      //  console.log("before randomizing")
      return generateRandomValues(hl.low, hl.high, 50);
    });

    return res.status(200).json(simulatedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
};

/*

{
data= [
(Day 1) [price , price , price ,price , price],
(Day 2) [price , price , price ,price , price],
(Day 3) [price , price , price ,price , price],
(Day 4) [price , price , price ,price , price],
(Day 5) [price , price , price ,price , price],
]

}
*/

module.exports = {
  RELIANCE
};

