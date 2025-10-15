const express = require("express");
const router = express.Router();
const authController = require("../../controllers/api/authController");

// Register user route
router.post("/register-34076352", authController.registerUser);

// Login user route
router.post("/login-34076352", authController.loginUser);

// Logout user route
router.post("/logout-34076352", authController.logoutUser);

module.exports = router;
