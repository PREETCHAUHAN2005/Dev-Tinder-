require("dotenv").config();
const Razorpay = require("razorpay");

const keyId = process.env.Razorpay_KEY_ID;
const keySecret = process.env.Razorpay_KEY_SECRET;

let instance = null;
if (keyId && keySecret) {
  instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

module.exports = instance;
