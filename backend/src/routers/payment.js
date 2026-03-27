const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/payment.js");

const razorpayInstance = require("../utils/razorpay.js");
const { userAuth } = require("../middleware/auth.js");
const membershipAmount = require("../utils/constants.js");

paymentRouter.post("/payment/create", async (req, res) => {
  try {
    const membershipType = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: "Silver",
      },
    });
    res.json({ order });
    console.log({ order });
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    console.log("Payment saved to DB:", savedPayment);
    res.json({
      message: "Payment created and saved successfully!",
      ...savedPayment.toJSON(),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error creating payment: " + error.message });
  }
});

module.exports = paymentRouter;
