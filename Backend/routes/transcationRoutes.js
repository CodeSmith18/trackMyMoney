const express = require('express');
const router = express.Router();
const Transaction = require("../Models/transctionModel.js");
const User = require("../Models/userModel.js");
const authenticateUser = require('../auth/authenticator.js');


router.post('/addTrans', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("_id");
        const userId = user._id;
        const { title, amount, type, date, category, description } = req.body;

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
router.post('/getIncome', authenticateUser, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("_id");
        const userId = user._id;

        const transactions = await Transaction.find({ userId, type: "income" })
            .sort({ date: -1 })
            .exec();

        if (transactions.length === 0) {
            return res.status(200).json({
                transactions: [],
                maxExpense: 0,
                minExpense: 0,
                sumExpense: 0,
                message: "No expense transactions found."
            });
        }

        const amounts = transactions.map(t => t.amount);
        const maxIncome = transactions.length > 0 ? Math.max(...amounts) : 0;
        const minIncome = transactions.length > 0 ? Math.min(...amounts) : 0;
        const sumIncome = transactions.length > 0 ? amounts.reduce((acc, val) => acc + val, 0) : 0;

        res.status(200).json({
            transactions,
            maxIncome,
            minIncome,
            sumIncome,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching expense transactions", error });
    }
});

router.post('/getTrans', authenticateUser, async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("_id");
        const userId = user._id;

        const transactions = await Transaction.find({ userId })
            .sort({ date: -1 })
            .exec();

        if (transactions.length === 0) {
            return res.status(200).json({
                transactions: [],
                maxExpense: 0,
                minExpense: 0,
                sumExpense: 0,
                message: "No expense transactions found."
            });
        }

        // const amounts = transactions.map(t => t.amount);
        // const maxExpense = transactions.length > 0 ? Math.max(...amounts) : 0;
        // const minExpense = transactions.length > 0 ? Math.min(...amounts) : 0;
        // const sumExpense = transactions.length > 0 ? amounts.reduce((acc, val) => acc + val, 0) : 0;

        res.status(200).json({
            transactions
           
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching expense transactions", error });
    }
});

router.post('/getExpense', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("_id");
        const userId = user._id;

        const transactions = await Transaction.find({ userId, type: "expense" })
            .sort({ date: -1 })
            .exec();

        if (transactions.length === 0) {
            return res.status(200).json({
                transactions: [],
                maxExpense: 0,
                minExpense: 0,
                sumExpense: 0,
                message: "No expense transactions found."
            });
        }

        const amounts = transactions.map(t => t.amount);
        const maxExpense = transactions.length > 0 ? Math.max(...amounts) : 0;
        const minExpense = transactions.length > 0 ? Math.min(...amounts) : 0;
        const sumExpense = transactions.length > 0 ? amounts.reduce((acc, val) => acc + val, 0) : 0;

        res.status(200).json({
            transactions,
            maxExpense,
            minExpense,
            sumExpense
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching expense transactions", error });
    }
});



router.post('/delete', authenticateUser, async (req, res) => {


    try {

        const { transactionId } = req.body;
        const user = await User.findById(req.user.id).select("_id");
        const userId = user._id;
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

router.post('/updateTrans', authenticateUser, async (req, res) => {
    try {
        const { transactionId, title, amount, type, date, category, description } = req.body;
        if (!transactionId) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        const user = await User.findById(req.user.id).select("_id");
        const userId = user._id;

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId: userId },
            { $set: { title, amount, type, date, category, description } },
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found or unauthorized" });
        }

        res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating the transaction" });
    }
});


module.exports = router;





