import { Progress } from "antd";
import React from "react";
import { Line } from "@ant-design/charts"; // Import the Line chart
import moment from "moment";
import "../resources/analatics.css";

function Analatics({ transactions }) {
  // --- Summary Calculations ---
  const totalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter((t) => t.type === "income");
  const totalExpenseTransactions = transactions.filter((t) => t.type === "expence");
  const totalIncomePercent = (totalIncomeTransactions.length / totalTransactions) * 100 || 0;
  const totalExpensePercent = (totalExpenseTransactions.length / totalTransactions) * 100 || 0;
  
  const totalTurnover = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncomeTurnover = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const totalExpenseTurnover = transactions.filter((t) => t.type === "expence").reduce((acc, t) => acc + t.amount, 0);
  const incomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100 || 0;
  const expenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100 || 0;

  // --- Dynamic Category Logic ---
  const incomeCategories = [...new Set(transactions.filter(t => t.type === 'income').map(t => t.category))];
  const expenseCategories = [...new Set(transactions.filter(t => t.type === 'expence').map(t => t.category))];

  // --- Line Plot Data Preparation ---
  const dailyAggregates = transactions.reduce((acc, t) => {
    const date = moment(t.date).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      acc[date].income += t.amount;
    } else {
      acc[date].expense += t.amount;
    }
    return acc;
  }, {});

  const linePlotData = Object.entries(dailyAggregates)
    .flatMap(([date, values]) => [
      { date, value: values.income, type: 'Income' },
      { date, value: values.expense, type: 'Expense' },
    ])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const linePlotConfig = {
    data: linePlotData,
    padding: 'auto',
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f'],
    yAxis: {
      label: { formatter: (v) => `₹${v}` },
    },
    tooltip: {
        formatter: (datum) => ({ name: datum.type, value: `₹${datum.value.toFixed(2)}` }),
    },
    point: { size: 4, shape: 'dot' },
    legend: { position: 'top-right' },
  };

  return (
    <div className="analytics-container">
      <div className="analytics-summary-row">
        <div className="analytics-summary-card">
          <h4>Transactions Count</h4>
          <div className="analytics-summary-stats">
            <h5>Total: {totalTransactions}</h5>
            <h5>Income: {totalIncomeTransactions.length}</h5>
            <h5>Expense: {totalExpenseTransactions.length}</h5>
          </div>
          <div className="analytics-summary-progress">
            {totalIncomeTurnover > 0 && <Progress type="circle" strokeColor="#52c41a" percent={Math.round(totalIncomePercent)} />}
            {totalExpenseTurnover > 0 && <Progress type="circle" strokeColor="#faad14" percent={Math.round(totalExpensePercent)} />}
          </div>
        </div>
        <div className="analytics-summary-card">
          <h4>Turnover</h4>
           <div className="analytics-summary-stats">
            <h5>Total: ₹{totalTurnover}</h5>
            <h5>Income: ₹{totalIncomeTurnover}</h5>
            <h5>Expense: ₹{totalExpenseTurnover}</h5>
          </div>
          <div className="analytics-summary-progress">
            {totalIncomeTurnover > 0 && <Progress type="circle" strokeColor="#52c41a" percent={Math.round(incomeTurnoverPercent)} />}
            {totalExpenseTurnover > 0 && <Progress type="circle" strokeColor="#faad14" percent={Math.round(expenseTurnoverPercent)} />}
          </div>
        </div>
      </div>

      <div className="analytics-category-row">
        {totalIncomeTurnover > 0 ? (
          <div className="analytics-category-analysis-card">
            <h4>Income by Category</h4>
            {incomeCategories.map((category) => {
              const amount = transactions
                .filter((t) => t.type === "income" && t.category === category)
                .reduce((acc, t) => acc + t.amount, 0);
              return amount > 0 && (
                <div key={category} className="analytics-category-item">
                  <div className="analytics-category-header">
                    <h5>{category}</h5>
                    <span>₹{amount}</span>
                  </div>
                  <Progress strokeColor="#1890ff" percent={Math.round((amount / totalIncomeTurnover) * 100)} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="analytics-category-analysis-card">
            <h4>Overall Trend for Period</h4>
            <div className="analytics-chart-container">
              <Line {...linePlotConfig} />
            </div>
          </div>
        )}

        {totalExpenseTurnover > 0 ? (
          <div className="analytics-category-analysis-card">
            <h4>Expense by Category</h4>
            {expenseCategories.map((category) => {
              const amount = transactions
                .filter((t) => t.type === "expence" && t.category === category)
                .reduce((acc, t) => acc + t.amount, 0);
              return amount > 0 && (
                <div key={category} className="analytics-category-item">
                  <div className="analytics-category-header">
                    <h5>{category}</h5>
                    <span>₹{amount}</span>
                  </div>
                  <Progress strokeColor="#ff4d4f" percent={Math.round((amount / totalExpenseTurnover) * 100)} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="analytics-category-analysis-card">
            <h4>Overall Trend for Period</h4>
            <div className="analytics-chart-container">
              <Line {...linePlotConfig} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analatics;