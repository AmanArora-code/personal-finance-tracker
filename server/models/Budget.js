const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Rent", "Shopping", "Travel", "Utilities", "Other"],
  },
  amount: {
    type: Number,
    required: true,
  },
  month: {
    type: String, // e.g., "2025-07"
    required: true,
  }
});

module.exports = mongoose.model("Budget", BudgetSchema);
