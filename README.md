# MoneyMate – Expense Tracker

### view live
## https://moneymate-expensetracker-wuta.onrender.com/login

MoneyMate is a **personal finance management app** that helps users track their income and expenses, categorize transactions, and visualize their financial health with ease.

## Project Structure

```
moneymate/               ← Root folder of your project
├─ client/               ← React frontend
│  ├─ package.json       ← React dependencies and scripts
│  ├─ public/            ← React public folder
│  ├─ src/               ← React source code
│  |─ build/             ← Created after `npm run build`
|  |-.env                ← Environment variables (never push this)
│
├─ server/               ← Node.js backend
│  ├─ server.js          ← Entry point for backend
│  ├─ dbConnect.js       ← MongoDB connection
│  ├─ passport.js        ← Google OAuth setup
│  ├─ routes/            ← API routes (usersRoute.js, transactionsRoute.js)
|  ├─ middleware/        ← middle ware for authentiaction(for protected routes)
|  |-models/             ← user and transaction models
│  |─ package.json       ← Backend dependencies and scripts
|  |-.env                ← Environment variables (never push this)
│
├─ package.json          ← Optional root package.json for convenience scripts
├─ .gitignore            ← Prevent sensitive files from being pushed
```

## Features

* **User Authentication**

  * Secure login and registration
  * Google OAuth login
  * JWT-based authentication

* **Dashboard Overview**

  * Summary of income, expenses, and balance
  * Charts for better financial insights

* **Transaction Management**

  * Add, edit, and delete transactions
  * Upload transactions via **Excel file**
  * Filter by date, category, or type

* **Responsive Design**

  * Works seamlessly on desktop and mobile devices
  * Lottie animations on large screens for a modern look

* **Intuitive UI**

  * Clean and modern interface with Ant Design components
  * Cards, tables, and charts styled for readability

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/moneymate-expense-tracker.git
```

2. Navigate to the client folder and install dependencies:

```bash
cd client
npm install
```

3. Navigate to the server folder and install dependencies:

```bash
cd ../server
npm install
```

4. Run the development servers:

* Backend: `node server.js` or `nodemon server.js`
* Frontend: `npm start` (from the `client` folder)

The frontend runs on `http://localhost:3000` and communicates with the backend API.

## Dependencies

* **Frontend:** React, Ant Design, Axios, Moment.js, Recharts, React Router, Lottie-react
* **Backend:** Node.js, Express, MongoDB, Mongoose, Passport, JSON Web Tokens (JWT)





