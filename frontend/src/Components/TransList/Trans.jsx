import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Trans.css";

const Trans = ({ transaction, getAllTrans }) => {
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
  const [showModal, setShowModal] = useState(false);
  const [updatedTrans, setUpdatedTrans] = useState({ ...transaction });

  // Function to delete transaction
  const remove = async () => {
    try {
      // Send delete request to the server
      await axios.post(
        "https://mymoney.ritikraj.tech/transaction/delete",
        { transactionId: transaction._id },
        { withCredentials: true }
      );
      toast.success("Transaction deleted successfully");

      // Trigger parent component to re-fetch transactions
      getAllTrans(); // Call getAllTrans to refresh data
    } catch (error) {
      toast.error("Error deleting transaction");
      console.error(error);
    }
  };

  // Function to update transaction
  const update = async () => {
    try {
      await axios.post(
        "https://mymoney.ritikraj.tech/transaction/updateTrans",
        { transactionId: updatedTrans._id, ...updatedTrans },
        { withCredentials: true }
      );
      toast.success("Transaction updated successfully");
      setShowModal(false);
    } catch (error) {
      toast.error("Error updating transaction");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTrans((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div
        className={`transaction-container ${
          transaction.type === "income" ? "income" : "expense"
        }`}
      >
        <h2>{transaction.title}</h2>
        <h2>{transaction.amount}</h2>
        <h2>{transaction.type}</h2>
        <h2>{transaction.date.substring(0, 10)}</h2>
        <h2>{transaction.category}</h2>
        <h2>{transaction.description}</h2>
        <button onClick={remove}>Delete</button>
        <button onClick={() => setShowModal(true)}>Update</button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Transaction</h2>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={updatedTrans.title}
              onChange={handleChange}
            />
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={updatedTrans.amount}
              onChange={handleChange}
            />
            <label>Type:</label>
            <select
              name="type"
              value={updatedTrans.type}
              onChange={handleChange}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={updatedTrans.date.substring(0, 10)}
              onChange={handleChange}
            />
            <label>Category:</label>
            <select
              name="category"
              value={updatedTrans.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {updatedTrans.type === "income" &&
                incomeCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              {updatedTrans.type === "expense" &&
                expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            <label>Description:</label>
            <textarea
              name="description"
              value={updatedTrans.description}
              onChange={handleChange}
            ></textarea>
            <button onClick={update}>Save Changes</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

Trans.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  getAllTrans: PropTypes.func.isRequired, // Pass getAllTrans as prop
};

export default Trans;
