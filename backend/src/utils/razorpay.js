require("dotenv").config();
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.Razorpay_KEY_ID,
  key_secret: process.env.Razorpay_KEY_SECRET,
});

module.exports = instance;
