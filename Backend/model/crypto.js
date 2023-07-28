// ../model/crypto.js
const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  current_price: Number,
  price_change: Number,
  percentage_change: Number,
  last_price_change_date: Date,
  last_updated: Date,
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
