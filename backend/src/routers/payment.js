const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/payment.js");

const razorpayInstance = require("../utils/razorpay.js");
const { userAuth } = require("../middleware/auth.js");
const { membershipAmount } = require("../utils/constants.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user.js");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const membershipType = req.body.type || req.body.membershipType;
    if (!membershipType || !membershipAmount[membershipType]) {
      return res.status(400).json({ error: "Invalid membership type: " + membershipType });
    }

    const { firstname, lastname, email } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#" + Date.now(),
      notes: {
        firstname,
        lastname,
        email,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    
    return res.json({
      message: "Payment created and saved successfully!",
      order,
      payment: savedPayment,
      keyId: process.env.Razorpay_KEY_ID,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error creating payment: " + error.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] || req.get("X-Razorpay-Signature");
    const WebhookSecret = process.env.Razorpay_WEBHOOK_SECRET;
    const isWebhookvalid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      WebhookSecret
    );
    if (!isWebhookvalid) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }
    
    // update payment status in DB based on the event type
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });
    
    if (payment) {
      payment.status = paymentDetails.status;
      payment.paymentId = paymentDetails.id;
      await payment.save();

      const user = await User.findOne({ _id: payment.userId });
      if (user) {
        user.isPremium = true;
        user.membershipType = payment.notes?.membershipType || "silver";
        await user.save();
      }
    }

    return res.status(200).json({ msg: "Webhook processed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error processing webhook: " + error.message });
  }
});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    return res.json({ isUserPremium: req.user.isPremium });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

paymentRouter.get("/payment/history", userAuth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id });
    return res.json({ payments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = paymentRouter;
