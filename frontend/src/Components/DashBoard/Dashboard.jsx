import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import TransactionChart from "../Visuals/line.jsx";
import PieChart from "../Visuals/Piechart.jsx";
import Transaction from "../TransList/Transactions.jsx";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState("charts");
  const [transactionSubmitted, setTransactionSubmitted] = useState(true);
  const [maxExpense, setmaxExpense] = useState(0);
  const [maxIncome, setmaxIncome] = useState(0);
  const [tincome,settincome] = useState(0);
  const [texpense,setTExpense] = useState(0);


  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/users/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully"); // Success toast
    } catch (error) {
      console.log(error);
      toast.error("Logout failed"); // Error toast
    }
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/users/profile",
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        toast.error("Please log in first"); // Error toast
        navigate("/login");
        console.log(error);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/transaction/getExpense",
          {},
          { withCredentials: true }
        );
        setExpense(response.data.transactions);
        console.log(response.data);
        setmaxExpense(response.data.maxExpense);
         setTExpense(response.data.sumExpense);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Error fetching expenses"); // Error toast
      }
    };

    const fetchIncome = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/transaction/getIncome",
          {},
          { withCredentials: true }
        );
        setIncome(response.data.transactions);
        console.log(response.data);
        setmaxIncome(response.data.maxIncome);
        settincome(response.data.sumIncome);
      } catch (error) {
        console.error("Error fetching income:", error);
        toast.error("Error fetching income"); // Error toast
      }
    };

    if (transactionSubmitted) {
      fetchExpense();
      fetchIncome();
      setTransactionSubmitted(false);
    }
  }, [transactionSubmitted]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "",
    date: "",
    category: "",
    description: " ",
    userId: "",
  });

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

  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "type") {
      setFormData((prevState) => ({
        ...prevState,
        category: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.userId = user._id;

      const response = await axios.post(
        "http://localhost:5000/transaction/addTrans",
        formData,
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setTransactionSubmitted(true);
      setError(null);
      setFormData({
        title: "",
        amount: "",
        type: "",
        date: "",
        category: "",
        description: "",
        userId: "",
      });
      toast.success(response.data.message); 
    } catch (error) {
      setError(error.response?.data?.error || "Internal Server Error");
      setMessage("");
      toast.error(error.response?.data?.error || "Internal Server Error"); // Error toast
    }
  };

  return user ? (
    <div className="dashboard">
      <div className="profile">
        <img src="user.png" alt="" />
        <h2>
          Welcome, {user.fname} {user.lname}
        </h2>
        <p>Email: {user.email}</p>
        <button onClick={logout}>Logout</button>

        <button onClick={() => setPage("charts")}>View Charts</button>
        <button onClick={() => setPage("addTransaction")}>Add Transaction</button>
        <button onClick={() => setPage("history")}>Transaction History</button>
      </div>

      {/* Conditional Rendering */}
      {page === "charts" && (
        <div className="insights">
          <div className="line-chart">
            <TransactionChart incomeData={income} expenseData={expense} />
          </div>
          <div className="balance">
          
          </div>
          <div>
           <h3> Total Balance = Income :  {tincome} - Expense : {texpense} = {tincome - texpense}</h3>
          </div>
          <div className="piechart">
            <div>
              <h2>Expenses</h2>
              <PieChart transactions={expense} />
              <h3>MaxExpense: {maxExpense}</h3>
            </div>
            <div>
              <h2>Incomes</h2>
              <PieChart transactions={income} />
              <h3>MaxIncome: {maxIncome}</h3>
            </div>
          </div>
        </div>
      )}

      {page === "addTransaction" && (
        <div className="insights">
          <h2>Add Transaction</h2>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="type">Type:</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.type}
                >
                  <option value="">Select Category</option>
                  {formData.type === "income" &&
                    incomeCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  {formData.type === "expense" &&
                    expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label htmlFor="description">Description (optional):</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button type="submit">Add Transaction</button>
            </form>
          </div>
        </div>
      )}

      {page === "history" && (
        <div className="insights">
          <Transaction />
        </div>
      )}

      {/* Toast Container for global toasts */}
      <ToastContainer />
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default Dashboard;
