const express = require('express');
const router = express.Router();
const Transaction = require("../Models/transctionModel.js");
const User = require("../Models/userModel.js");


router.post('/addTrans', async (req, res) => {
    try {
        const { title, amount, type, date, category, description, userId } = req.body;

        if (!title || !amount || !type || !date || !category || !userId) {
            return res.status(400).json({ error: "All fields except description are required" });
        }

        const newTrans = new Transaction({ title, amount, type, date, category, description, userId });
        await newTrans.save();

        await User.findByIdAndUpdate(userId, { $push: { transactions: newTrans._id } });

        res.status(201).json({ message: "Transaction added successfully", transaction: newTrans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/getIncome', async (req, res) => {
    const { userId } = req.body;

    try {
        const transactions = await Transaction.find({ userId, type: "income" })
            .sort({ date: -1 })  
            .exec();

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No income transactions found." });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching income transactions", error });
    }
});

router.post('/getExpense', async (req, res) => {
    const { userId } = req.body;

    try {
        const transactions = await Transaction.find({ userId, type: "expense" })
            .sort({ date: -1 })  
            .exec();

        if (transactions.length === 0) {
            return res.status(404).json({ message: "No income transactions found." });
        }

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching income transactions", error });
    }
});

router.delete('/delete', async (req, res) => {
    const { userId, transactionId } = req.body;

    try {
        const transaction = await Transaction.findOneAndDelete({ _id: transactionId, userId: userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or not associated with this user." });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { transactions: transactionId } }
        );

        res.status(200).json({ message: "Transaction deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting the transaction", error });
    }
});

module.exports = router;





