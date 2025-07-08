import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  );

  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/expenses",
        headers
      );
      setExpenses(res.data);
    };
    fetchExpenses();
  }, []);

  const monthName = new Date(`${selectedMonth}-01`).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const thisMonthExpenses = expenses.filter(
    (e) => e.date.slice(0, 7) === selectedMonth
  );

  const totalSpent = thisMonthExpenses.reduce((acc, e) => acc + e.amount, 0);

  const categoryMap = {};
  const methodMap = {};
  const dateMap = {};

  thisMonthExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    methodMap[e.paymentMethod] = (methodMap[e.paymentMethod] || 0) + 1;

    const d = new Date(e.date).toLocaleDateString("en-CA");
    dateMap[d] = (dateMap[d] || 0) + e.amount;
  });

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const topMethods = Object.entries(methodMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([method, count]) => `${method} (${count}x)`);

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Spend ₹",
        data: Object.values(categoryMap),
        backgroundColor: [
          "#f87171",
          "#34d399",
          "#60a5fa",
          "#fbbf24",
          "#a78bfa",
          "#f472b6",
        ],
      },
    ],
  };

  const lineData = {
    labels: Object.keys(dateMap),
    datasets: [
      {
        label: "₹ Spent",
        data: Object.values(dateMap),
        fill: false,
        borderColor: "#4f46e5",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="container">
      <section>
        <h2>📊 Dashboard – {monthName}</h2>

        <label>Select Month: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <p>
          <strong>Total Spent:</strong> ₹{totalSpent}
        </p>
        <p>
          <strong>Top Category:</strong> {topCategory}
        </p>
        <p>
          <strong>Top Payment Methods:</strong>
        </p>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {topMethods.map((m, i) => (
            <li key={i}>• {m}</li>
          ))}
        </ul>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "50px",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "350px" }}>
            <h4>📍 Category-wise Spend</h4>
            <Pie data={pieData} />
          </div>
          <div style={{ width: "500px" }}>
            <h4>📈 Daily Spend Trend</h4>
            <Line data={lineData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
