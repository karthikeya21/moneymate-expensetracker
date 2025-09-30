import React from "react";
import { Card } from "antd";
import moment from "moment";
import DashboardSummary from "./DashboardSummary";
import Analatics from "./Analatics";
import "../resources/Overview.css";

function Overview({ transactions }) {
  // Compute totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expence")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Latest 5 transactions
  const latestFive = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="overview">
      <h2>Overview</h2>

      {/* Summary Cards */}
      <DashboardSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        netBalance={netBalance}
      />

      {/* Recent Activity */}
      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="latest-cards">
          {latestFive.map((t) => (
            <Card key={t._id} className="latest-card">
              <div className="latest-info">
                <span>{moment(t.date).format("DD MMM")}</span>
                <strong>{t.category}</strong>
              </div>
              <span
                className={t.type === "income" ? "income-text" : "expense-text"}
              >
                {t.type === "income" ? "+" : "-"}₹{t.amount}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Graph / Analytics */}
      <div className="overview-analytics">
        <Analatics transactions={transactions} />
      </div>
    </div>
  );
}

export default Overview;
