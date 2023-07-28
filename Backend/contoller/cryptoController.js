const Crypto = require("../model/crypto");
const axios = require("axios");
const cron = require("cron");
const moment = require("moment");
const socketIOClient = require("socket.io-client");


const vsCurrency = "usd"; // Replace with the desired currency (e.g., "eur" for Euros, "gbp" for British Pounds, etc.)
let cryptosData = [];
// Function to fetch cryptocurrency updates from the CoinGecko API

// Get all cryptocurrencies from the database and sort by price in descending order
const getAllcrypto = async (req, res, next) => {
  try {
    const cryptos = await Crypto.find().sort({ price: -1 });
    res.json({ cryptos });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting crypto",
      error: error.message || "Internal server error",
    });
  }
};


let previousPrice = null;
// Assuming you have a model named 'Crypto' defined for your MongoDB collection
const getCryptoUpdates = async () => {
  try {
    const vsCurrency = "usd"; // Change this to your desired currency

    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: vsCurrency,
      },
    });

    const cryptosData = response.data.map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol,
      current_price: crypto.current_price,
      price_change: crypto.price_change_24h,
      percentage_change: crypto.percentage_change_24h,
      last_price_change_date: crypto.last_price_change_date,
      last_updated: crypto.last_updated,
    }));

    console.log("Data fetched successfully.");

    // Save the data to the database
    for (const crypto of cryptosData) {
      // Check if the crypto already exists in the database using its symbol
      const existingCrypto = await Crypto.findOne({ symbol: crypto.symbol });

      if (existingCrypto) {
        // If the crypto exists, update its data in the database
        existingCrypto.current_price = crypto.current_price;
        existingCrypto.price_change = crypto.price_change;
        existingCrypto.percentage_change = crypto.percentage_change;
        existingCrypto.last_price_change_date = crypto.last_price_change_date;
        existingCrypto.last_updated = crypto.last_updated;

        await existingCrypto.save();
      } else {
        // If the crypto does not exist, create a new document in the database
        const newCrypto = new Crypto(crypto);
        await newCrypto.save();
      }
    }

    return cryptosData;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate-limit exceeded. Waiting for a moment before retrying...");
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait for 1 minute before retrying
      return getCryptoUpdates(); // Retry the request
    } else {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  }
};
exports.getAllcrypto = getAllcrypto;
exports.getCryptoUpdates = getCryptoUpdates;

