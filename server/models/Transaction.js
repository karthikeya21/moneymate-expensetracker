const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userid : { type: String, required: true},
  amount: { type: Number},
  type: { type: String},
  category: { type: String},
  reference: { type: String },
  description: { type: String },
  date: { type: Date},
});

const transactionModel = mongoose.model("Trasactions", transactionSchema);

module.exports = transactionModel;
