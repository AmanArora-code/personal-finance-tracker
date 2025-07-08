const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const jwt = require("jsonwebtoken");

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
}

// Add expense
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    const newExpense = new Expense({
      userId: req.userId,
      title,
      amount,
      category,
      paymentMethod,
      date,
      notes,
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense added" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add expense", details: err.message });
  }
});

// Get all expenses for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to get expenses" });
  }
});

// Delete expense
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});
// Update expense by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, date, notes } = req.body;

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        category,
        paymentMethod,
        date,
        notes
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Expense not found" });

    res.json({ message: "Expense updated", expense: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

module.exports = router;
