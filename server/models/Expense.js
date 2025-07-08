const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Rent", "Shopping", "Travel", "Utilities", "Other"], // you can customize
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["UPI", "Credit Card", "Debit Card", "Cash", "Net Banking", "Other"],
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
