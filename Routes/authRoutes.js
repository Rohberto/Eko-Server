const express = require("express");
const authRoute = express.Router();
const {Login, signUp, verifyOtp, resendOTP, forgotPassword, resetPassword, googleAuth} = require("../Controllers/auth");

authRoute.post("/login", Login);
authRoute.post("/signup", signUp);
authRoute.post("/verifyOtp", verifyOtp);
authRoute.post("/resendotp", resendOTP);
authRoute.post("/forgotpassword", forgotPassword);
authRoute.post("/resetpassword/:id/:token", resetPassword);
authRoute.post("/google-auth", googleAuth);
module.exports = authRoute;