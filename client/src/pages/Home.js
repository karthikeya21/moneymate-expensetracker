import React, { useEffect, useState } from "react";
import { DatePicker, Select, Table, message, Upload, Button, Tooltip } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

import DefaultLayout from "../components/DefaultLayout";
import AddEditTransaction from "../components/AddEditTransaction";
import DashboardSummary from "../components/DashboardSummary";
import Analatics from "../components/Analatics";
import InsightsPanel from "../components/InsightsPanel";

import "../resources/home.css";

const { RangePicker } = DatePicker;

function Home() {
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  // --- STEP 1: Add new state for insights data ---
  const [insightsData, setInsightsData] = useState([]);

  const [showAddEditTransactionModal, setShowAddEditTransactionModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const [viewType, setViewType] = useState("Data");

  const getAuthConfig = () => {
    const user = JSON.parse(localStorage.getItem("moneymate-user"));
    if (!user?.token) {
      message.error("Please login first");
      return null;
    }
    return { headers: { Authorization: `Bearer ${user.token}` } };
  };

  const getTransactions = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/transactions/get-all-transactions",
        {
          frequency,
          ...(frequency === "custom" && { selectedRange: selectedRange.map(d => d.toDate()) }),
          type,
        },
        config
      );
      setTransactionsData(response.data);
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Create a separate function to fetch data for insights ---
  const getInsightsData = async () => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      // This fetch is independent of the user's selected filters.
      // We'll fetch the last 30 days of all transactions for a stable insight view.
      const response = await axios.post(
        "/api/transactions/get-all-transactions",
        {
          frequency: "30", // Always fetch last 30 days
          type: "all",     // Always fetch all types
        },
        config
      );
      setInsightsData(response.data);
    } catch (error) {
      // No need to show an error message here, as the main table will show it.
      console.error("Failed to fetch insights data:", error);
    }
  };

  // --- STEP 3: Create a function to refresh all data ---
  // This will be called after adding, editing, or deleting transactions.
  const refreshAllData = () => {
    getTransactions();
    getInsightsData();
  };

  const deleteTransaction = async (record) => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      setLoading(true);
      await axios.post("/api/transactions/delete-transaction", { transactionId: record._id }, config);
      message.success("Transaction deleted successfully");
      // --- STEP 4: Refresh BOTH datasets on delete ---
      refreshAllData();
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // This useEffect fetches filtered data and is re-run whenever filters change.
  useEffect(() => {
    getTransactions();
  }, [frequency, selectedRange, type]);

  // --- STEP 5: This useEffect fetches insights data ONCE on page load ---
  useEffect(() => {
    getInsightsData();
  }, []); // The empty array ensures this runs only once.


  const totalIncome = transactionsData.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactionsData.filter(t => t.type === "expence").reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const columns = [
    { title: "Date", dataIndex: "date", render: text => moment(text).format("YYYY-MM-DD") },
    { title: "Amount", dataIndex: "amount" },
    { title: "Category", dataIndex: "category" },
    { title: "Type", dataIndex: "type" },
    { title: "Reference", dataIndex: "reference" },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => { setSelectedItemForEdit(record); setShowAddEditTransactionModal(true); }} />
          <DeleteOutlined className="mx-3" onClick={() => deleteTransaction(record)} />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout viewType={viewType} setViewType={setViewType}>
      {loading && <div className="spinner">Loading...</div>}

      <div className="home-layout">
        <div className="left-column">
          <DashboardSummary totalIncome={totalIncome} totalExpense={totalExpense} netBalance={netBalance} />
        </div>

        <div className="middle-column">
          <div className="top-bar">
            <Select value={frequency} onChange={v => setFrequency(v)} style={{ width: 150 }}>
              <Select.Option value="7">1 Week</Select.Option>
              <Select.Option value="30">1 Month</Select.Option>
              <Select.Option value="365">1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency === "custom" && <RangePicker value={selectedRange} onChange={values => setSelectedRange(values)} />}
            
            <Select value={type} onChange={v => setType(v)} style={{ width: 120 }}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expence">Expense</Select.Option>
            </Select>

            {/* Upload logic remains the same */}
            <Upload /* ...props... */ >
              <Button icon={<UploadOutlined />} />
            </Upload>

            <Button className="primary" onClick={() => setShowAddEditTransactionModal(true)}>Add New</Button>
          </div>

          <div className="table-scroll">
            {viewType === "Data" ? (
              <Table columns={columns} dataSource={transactionsData} rowKey="_id" pagination={{ pageSize: 10 }} />
            ) : (
              <Analatics transactions={transactionsData} />
            )}
          </div>
        </div>

        <div className="right-column">
          {/* --- STEP 6: Pass the new insightsData to the panel --- */}
          <InsightsPanel transactions={insightsData} />
        </div>
      </div>

      {showAddEditTransactionModal && (
        <AddEditTransaction
          showAddEditTransactionModal={showAddEditTransactionModal}
          setShowAddEditTransactionModal={setShowAddEditTransactionModal}
          selectedItemForEdit={selectedItemForEdit}
          // --- STEP 7: Ensure the modal refreshes BOTH datasets ---
          getTransactions={refreshAllData}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;