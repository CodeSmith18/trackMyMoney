const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");



router.post('/signUp', async (req, res) => {
    try {
        const { fname,lname,email, password } = req.body;

        if (!email || !password || !fname || !lname) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email Already Exist, try login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fname,lname,email, password: hashedPassword });

        await newUser.save();

        return res.status(201).json({ success: true, message: "User registered successfully", userId: newUser._id });
    } 
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email , password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing username or password" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

      
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Incorrect password" });
            }
       

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });

        return res.status(200).json({ success: true, message: "Login successful", token ,  user : user._id });
    } 
    catch (error) {
        console.error('Server error during login:', error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
