import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseManager from "./pages/ExpenseManager";
import Dashboard from "./pages/Dashboard";

function App() {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login on load
  useEffect(() => {
    if (localStorage.getItem("token")) setIsLoggedIn(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        registerData
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        loginData
      );
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      <h1
        style={{ marginBottom: "30px", fontSize: "32px", textAlign: "center" }}
      >
        Personal Finance Tracker 💸
      </h1>

      {!isLoggedIn ? (
        <div
          style={{
            display: "flex",
            gap: "60px",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Register */}
          <form onSubmit={handleRegister}>
            <h3>Register</h3>
            <input
              placeholder="Name"
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <button type="submit">Register</button>
          </form>

          {/* Login */}
          <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <>
          <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
            Logout
          </button>
          <ExpenseManager />
          <Dashboard />
        </>
      )}
    </div>
  );
}

export default App;
