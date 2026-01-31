// require('dotenv').config();
// const axios = require('axios');
// const mongoose = require('mongoose');
// const TradingData = require('../Schemas/TradingDataSchema.js');


// const API_KEY = process.env.DATA_API_KEY;
// const SYMBOL = 'SBIN.BSE';
// const OUTPUT_SIZE = 'compact';

// // Construct the Alpha Vantage API URL
// const API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${SYMBOL}&outputsize=${OUTPUT_SIZE}&apikey=${API_KEY}`;

// console.log(' API URL:', API_URL);


// const fetchAndSaveData = async () => {
//   try {
//     console.log(`\n Fetching trading data for ${SYMBOL}...`);
    
//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ MongoDB connected');

//     // Fetch data from API
//     const response = await axios.get(API_URL);
//     const data = response.data;

//     // Validate response
//     if (data['Error Message']) {
//       throw new Error(`API Error: ${data['Error Message']}`);
//     }

//     if (!data['Time Series (Daily)']) {
//       throw new Error('No time series data found in API response');
//     }

//     // Extract metadata
//     const metaData = data['Meta Data'];

//     console.log(`\n Data received:`);
//     console.log(`   - Symbol: ${metaData['2. Symbol']}`);
//     console.log(`   - Last Refreshed: ${metaData['3. Last Refreshed']}`);
//     console.log(`   - Data Points: ${Object.keys(data['Time Series (Daily)']).length}`);

//     // Create and save trading record
//     const tradingRecord = new TradingData({
//       metaData: {
//         information: metaData['1. Information'],
//         symbol: metaData['2. Symbol'],
//         lastRefreshed: new Date(metaData['3. Last Refreshed']),
//         outputSize: metaData['4. Output Size'],
//         timeZone: metaData['5. Time Zone']
//       },
//       timeSeries: data['Time Series (Daily)']
//     });

//     const savedRecord = await tradingRecord.save();

//     console.log(`\n✅ Trading data saved to MongoDB!`);
//     console.log(`   - Record ID: ${savedRecord._id}`);
//     console.log(`   - Symbol: ${savedRecord.metaData.symbol}`);
//     console.log(`   - Data Points Saved: ${Object.keys(savedRecord.timeSeries).length}`);

//     await mongoose.connection.close();
//     console.log('\n✅ Database connection closed');

//   } catch (error) {
//     console.error('\n❌ Error:', error.message);
//     process.exit(1);
//   }
// };

// // Run the script
// if (require.main === module) {
//   fetchAndSaveData();
// }