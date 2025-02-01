import { useEffect, useState } from "react";
import axios from "axios";
import Trans from "./Trans";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Transcation.css";

const Transaction = () => {
  const incomeCategories = [
    "Salary",
    "Investments",
    "Pension",
    "Side Income",
    "Gifts & Inheritance",
  ];
  const expenseCategories = [
    "Essentials",
    "Household & Utilities",
    "Lifestyle",
    "Savings & Investments",
    "Social & Occasional",
  ];

  const [transList, setTransList] = useState([]);
  const [filteredTrans, setFilteredTrans] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getAllTrans = async () => {
    try {
      const response = await axios.post(
        "http://65.0.183.166:5000/transaction/getTrans",
        {},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      setTransList(response.data.transactions);
      setFilteredTrans(response.data.transactions); // Initialize filtered transactions
    } catch (error) {
      toast.error("Error fetching transactions");
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    getAllTrans(); // Fetch transactions on initial load
  }, []);

  // Reset filter values and re-fetch transactions
  const reset = () => {
    setFilteredTrans(transList);
    setTransactionType("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    toast.info("Filters reset successfully");
  };

  // Apply filters
  useEffect(() => {
    let filtered = transList;

    if (transactionType) {
      filtered = filtered.filter((t) => t.type === transactionType);
    }
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }
    if (startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(endDate));
    }

    setFilteredTrans(filtered);
  }, [transactionType, category, startDate, endDate, transList]);

  return (
    <div className="history">
       <h2>Transactions</h2>
      <div className="filters">
        <button onClick={reset}>Reset Filters</button>

        <label>Type:</label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          {transactionType === "income" &&
            incomeCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          {transactionType === "expense" &&
            expenseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
      <ul>
        {filteredTrans.map((transaction) => (
          <Trans key={transaction._id} transaction={transaction} getAllTrans={getAllTrans} />
        ))}
      </ul>
      </div>
     

      <ToastContainer />
    </div> 
     
   
  );
};

export default Transaction;
