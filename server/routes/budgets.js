const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
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

// Add or update budget
router.post("/", verifyToken, async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    const existing = await Budget.findOne({
      userId: req.userId,
      category,
      month
    });

    if (existing) {
      existing.amount = amount;
      await existing.save();
      return res.json({ message: "Budget updated" });
    }

    const newBudget = new Budget({ userId: req.userId, category, amount, month });
    await newBudget.save();

    res.status(201).json({ message: "Budget set successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to set budget" });
  }
});

// Get budgets for a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});

module.exports = router;
