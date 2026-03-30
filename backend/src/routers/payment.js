const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/payment.js");

const razorpayInstance = require("../utils/razorpay.js");
const { userAuth } = require("../middleware/auth.js");
const membershipAmount = require("../utils/constants.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user.js");

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
        membershipType: membershipType,
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
    const webhookSignature = req.get["X-Razorpay-Signature"];
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
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    const membershipType = payment.notes.membershipType;

    user.isPremium = true;

    await user.save();

    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }

    return res.status(200).json({ msg: "Webhook processed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error processing webhook: " + error.message });
  }
});

paymentRouter.get("/payment/history", userAuth, async (req, res) => {
  const user = req.user;
  if (user.isPremium) {
    return res.json({
      message: "You are a premium user, you have access to all the content!",
    });
  }
  return res.json({
    message:
      "You are not a premium user, please subscribe to access all the content!",
  });
});

module.exports = paymentRouter;
