import React from "react";
import { Card, Progress, Statistic, Row, Col ,Typography} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import moment from "moment";
import "../resources/insightsPanel.css"; // Make sure this CSS file exists
const { Title, Text } = Typography;
function InsightsPanel({ transactions }) {
  // Filter expenses
  const expenses = transactions.filter((t) => t.type === "expence");

  // --- NEW INSIGHT CALCULATION ---
  // Weekly Spending Trend
  const thisWeekStart = moment().startOf("week");
  const thisWeekEnd = moment().endOf("week");
  const lastWeekStart = moment().subtract(1, "week").startOf("week");
  const lastWeekEnd = moment().subtract(1, "week").endOf("week");

  const thisWeekTotal = expenses
    .filter((t) => moment(t.date).isBetween(thisWeekStart, thisWeekEnd))
    .reduce((sum, t) => sum + t.amount, 0);

  const lastWeekTotal = expenses
    .filter((t) => moment(t.date).isBetween(lastWeekStart, lastWeekEnd))
    .reduce((sum, t) => sum + t.amount, 0);

  const percentageChange =
    lastWeekTotal > 0
      ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
      : thisWeekTotal > 0
      ? 100
      : 0;
       // --- NEW LOGIC FOR CARD 2 ---
  // Day-of-the-Week Spending Habits for the current month
  const startOfMonth = moment().startOf("month");
  const monthlyExpenses = expenses.filter((t) => moment(t.date).isSameOrAfter(startOfMonth));

  const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Index 0 is Sunday, 6 is Saturday
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  monthlyExpenses.forEach((transaction) => {
    const dayOfWeek = moment(transaction.date).day();
    dayTotals[dayOfWeek] += transaction.amount;
  });

  const maxSpending = Math.max(...dayTotals);
  const busiestDayIndex = dayTotals.indexOf(maxSpending);
  const busiestDay = dayNames[busiestDayIndex];

  return (
    <div className="insights-panel">
      <h4>Insights</h4>

      {/* --- REPLACED CARD --- */}
      <Card title="Weekly Spending Trend" className="insight-card">
        <Row align="middle">
          <Col span={12}>
            <Statistic
              title="This Week"
              value={thisWeekTotal}
              precision={2}
              prefix="₹"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="vs. Last Week"
              value={percentageChange}
              precision={1}
              valueStyle={{
                color: percentageChange > 0 ? "#cf1322" : "#3f8600",
                fontSize: "1rem",
              }}
              prefix={
                percentageChange > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="%"
            />
          </Col>
        </Row>
        <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
            Last week's total: ₹{lastWeekTotal.toFixed(2)}
        </p>
      </Card>

      
            <Card title="Your Weekly Habit" className="insight-card">
            {maxSpending > 0 ? (
              <div>
                <Text>This month, you spend the most on:</Text>
                <Title level={3} style={{ marginTop: '4px', color: '#1890ff' }}>{busiestDay}s</Title>
                <Text type="secondary">Consider planning your budget around this day.</Text>
              </div>
            ) : (
              <p>No spending recorded this month to analyze habits.</p>
            )}
          </Card>

     
    </div>
  );
}

export default InsightsPanel;