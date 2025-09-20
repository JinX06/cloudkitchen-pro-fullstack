const express = require("express");
const router = express.Router();
const authController = require("../../controllers/pages/authController");

router.get("/login-34076352", authController.getLoginPage);

router.post("/login-34076352", authController.postLogin);

router.get("/logout-34076352", authController.getLogout);

router.get("/signup-34076352", authController.getSignupPage);

router.post("/signup-34076352", authController.postSignup);

module.exports = router;
