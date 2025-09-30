import React from "react";
import { Card } from "antd";
import "../resources/dashboardSummary.css";

function DashboardSummary({ totalIncome, totalExpense, netBalance }) {
  return (
    <div className="dashboard-summary-vertical">
      <Card className="summary-card income-card">
        <h4>Total Income</h4>
        <p>₹{totalIncome}</p>
      </Card>

      <Card className="summary-card expense-card">
        <h4>Total Expense</h4>
        <p>₹{totalExpense}</p>
      </Card>

      <Card className="summary-card balance-card">
        <h4>Net Balance</h4>
        <p>₹{netBalance}</p>
      </Card>
    </div>
  );
}

export default DashboardSummary;
