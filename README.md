# 💰 Personal Finance Tracker

A full-stack web application that helps users manage their expenses, set monthly budgets, and track financial goals.

## 🔗 Live Links

- **Frontend (Vercel)**: [https://personal-finance-tracker-delta-eight.vercel.app](https://personal-finance-tracker-delta-eight.vercel.app)
- **Backend (Render)**: [https://personal-finance-backend-exd8.onrender.com](https://personal-finance-backend-exd8.onrender.com)

---

## 🧰 Features

- 🔐 User authentication (Register/Login)
- 💸 Add, edit & delete expenses
- 🧾 Filter/search by category, method, date
- 📊 Dashboard: total spend, top category, payment stats, charts
- 🚨 Budget alerts on category overspending
- 📦 Persistent data using MongoDB

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Deployment**: Vercel (frontend), Render (backend)

---

## 🚀 How to Run Locally

### Frontend:

```bash
cd client
npm install
npm run dev
```

### Backend:

```bash
cd server
npm install
node index.js
````
---

## 🧪 Test Credentials

```
email: user@example.com
password: 123456
```

---

## 🧾 Environment Variables

Create a `.env` file in each of the following folders:

### 📁 client/.env

```env
VITE_API_URL=http://localhost:5000
```

### 📁 server/.env

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 📁 .env.example Files

### 📁 client/.env.example

```env
VITE_API_URL=http://localhost:5000
```

### 📁 server/.env.example

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
---

## 🙌 Author

**Aman Arora**  
MCA Graduate
Aspiring Full Stack Developer  
GitHub: [AmanArora-code](https://github.com/AmanArora-code)

---
