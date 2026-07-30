const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    getUsers,
} = require("../controller/authController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Admin Route
router.get("/users", protect, admin, getUsers);

module.exports = router;