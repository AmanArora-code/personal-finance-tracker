import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    paymentMethod: "UPI",
    date: "",
    notes: "",
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paymentMethod: "",
    fromDate: "",
    toDate: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    category: "Food",
    amount: "",
  });
  const [budgets, setBudgets] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        headers
      );
      setExpenses(res.data);
    } catch (err) {
      alert("Failed to fetch expenses");
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/budgets`, headers);
      setBudgets(res.data);
    } catch (err) {
      alert("Failed to fetch budgets");
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchBudgets();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/expenses/${editingId}`,
          form,
          headers
        );
        setEditingId(null);
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/expenses/add`,
          form,
          headers
        );
      }

      setForm({
        title: "",
        amount: "",
        category: "Food",
        paymentMethod: "UPI",
        date: "",
        notes: "",
      });

      fetchExpenses();
    } catch (err) {
      alert("Failed to save expense");
    }
  };

  const handleEdit = (exp) => {
    setForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      paymentMethod: exp.paymentMethod,
      date: exp.date.slice(0, 10),
      notes: exp.notes || "",
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, headers);
      fetchExpenses();
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  const getCategoryTotals = () => {
    const totals = {};
    const currentMonth = new Date().toISOString().slice(0, 7);

    expenses.forEach((exp) => {
      const expenseMonth = exp.date.slice(0, 7);
      if (expenseMonth === currentMonth) {
        if (!totals[exp.category]) totals[exp.category] = 0;
        totals[exp.category] += exp.amount;
      }
    });

    return totals;
  };

  return (
    <div className="container">
      {/* Set Budget */}
      <section>
        <h3>📌 Set Monthly Budget</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const body = {
              category: budgetForm.category,
              amount: Number(budgetForm.amount),
              month: new Date().toISOString().slice(0, 7),
            };

            try {
              const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/budgets`,
                body,
                headers
              );
              alert(res.data.message);
              setBudgetForm({ category: "Food", amount: "" });
              fetchBudgets();
            } catch (err) {
              alert("Failed to set budget");
            }
          }}
        >
          <select
            value={budgetForm.category}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, category: e.target.value })
            }
          >
            <option>Food</option>
            <option>Rent</option>
            <option>Shopping</option>
            <option>Travel</option>
            <option>Utilities</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Enter amount"
            value={budgetForm.amount}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, amount: e.target.value })
            }
            required
          />

          <button type="submit">Set Budget</button>
        </form>
      </section>

      {/* Budget Alerts */}
      <section>
        <h3>⚠️ Budget Alerts</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(getCategoryTotals()).map(([category, spent]) => {
            const month = new Date().toISOString().slice(0, 7);
            const budget = budgets.find(
              (b) => b.category === category && b.month === month
            );
            if (!budget) return null;

            const percent = (spent / budget.amount) * 100;
            if (percent >= 100)
              return (
                <li key={category} style={{ color: "red" }}>
                  🚨 Overbudget in {category} (₹{spent} / ₹{budget.amount})
                </li>
              );
            else if (percent >= 80)
              return (
                <li key={category} style={{ color: "orange" }}>
                  ⚠️ 80% used in {category} (₹{spent} / ₹{budget.amount})
                </li>
              );
            return null;
          })}
        </ul>
      </section>

      {/* Add/Edit Expense */}
      <section>
        <h3>{editingId ? "✏️ Edit Expense" : "➕ Add Expense"}</h3>
        <form onSubmit={handleAddExpense}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Food</option>
            <option>Rent</option>
            <option>Shopping</option>
            <option>Travel</option>
            <option>Utilities</option>
            <option>Other</option>
          </select>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          >
            <option>UPI</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>Cash</option>
            <option>Net Banking</option>
            <option>Other</option>
          </select>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          ></textarea>
          <button type="submit">{editingId ? "Update" : "Add"} Expense</button>
        </form>
      </section>

      {/* Filters */}
      <section>
        <h3>🔍 Search & Filter</h3>
        <input
          placeholder="Search title or notes"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option>Food</option>
          <option>Rent</option>
          <option>Shopping</option>
          <option>Travel</option>
          <option>Utilities</option>
          <option>Other</option>
        </select>
        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters({ ...filters, paymentMethod: e.target.value })
          }
        >
          <option value="">All Methods</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Cash</option>
          <option>Net Banking</option>
          <option>Other</option>
        </select>
        <br />
        <label>From: </label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        />
        <label>To: </label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        />
      </section>

      {/* Expense List */}
      <section>
        <h3>📄 Your Expenses</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {expenses
            .filter((exp) => {
              const matchesSearch =
                exp.title
                  .toLowerCase()
                  .includes(filters.search.toLowerCase()) ||
                exp.notes.toLowerCase().includes(filters.search.toLowerCase());
              const matchesCategory = filters.category
                ? exp.category === filters.category
                : true;
              const matchesMethod = filters.paymentMethod
                ? exp.paymentMethod === filters.paymentMethod
                : true;
              const expenseDate = new Date(exp.date);
              const fromDate = filters.fromDate
                ? new Date(filters.fromDate)
                : null;
              const toDate = filters.toDate ? new Date(filters.toDate) : null;
              const matchesDate =
                (!fromDate || expenseDate >= fromDate) &&
                (!toDate || expenseDate <= toDate);
              return (
                matchesSearch && matchesCategory && matchesMethod && matchesDate
              );
            })
            .map((exp) => (
              <li
                key={exp._id}
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid gray",
                  paddingBottom: "10px",
                }}
              >
                <strong>{exp.title}</strong> - ₹{exp.amount} <br />
                📅 {new Date(exp.date).toLocaleDateString()} | 📂 {exp.category}{" "}
                | 💳 {exp.paymentMethod} <br />
                📝 {exp.notes || "No notes"} <br />
                <button
                  onClick={() => handleEdit(exp)}
                  style={{ marginTop: "5px", marginRight: "10px" }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(exp._id)}>Delete</button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
};

export default ExpenseManager;
