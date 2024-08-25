const express = require("express");
const { handleSignup, handleLogin,handleVerifyOtp } = require("../controllers/auth.conroller.js");

const router = express.Router();


router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.post("/verify-otp",handleVerifyOtp)

module.exports = router;