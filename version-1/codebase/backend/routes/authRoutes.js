const express = require("express");
const router = express.Router();
const { registerUser, sendOTP, verifyOTP, finalSignUp, resendOTP, getFollowersCount, loginUser, sendEmailOTP, sendOTPForgotPassword, forgotPassVerify, updatePassword } = require('../controllers/authController')

router.post('/signup', registerUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/final-signup', finalSignUp);
router.post('/resend-otp', resendOTP);
router.post('/followers-count', getFollowersCount);
router.post('/login', loginUser);
router.post('/email-otp', sendEmailOTP);    // for forgot password email otp
router.post('/mobile-otp', sendOTPForgotPassword);    // for forgot password mobile otp
router.post('/fp-otp-verify', forgotPassVerify);    // for forgot password verify otp
router.post('/update-password', updatePassword);    // for forgot password


module.exports = router;