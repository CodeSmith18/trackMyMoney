const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel.js");
const router = express.Router();
const authenticateUser = require("../auth/authenticator.js");
require("dotenv").config();

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const NODE_ENV = process.env.NODE_ENV || "development";
const BCRYPT_SALT_ROUNDS = 10;

router.post("/signUp", async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

    if (!email || !password || !fname || !lname) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists, try logging in" });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const newUser = new User({ fname, lname, email, password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Server error during login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: NODE_ENV === "production" });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/profile", authenticateUser, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  });



module.exports = router;
