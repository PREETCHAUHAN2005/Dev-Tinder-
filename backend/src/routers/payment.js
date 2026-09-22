const express = require("express");
const crypto = require("crypto");
const paymentRouter = express.Router();
const Payment = require("../models/payment.js");

const razorpayInstance = require("../utils/razorpay.js");
const { userAuth } = require("../middleware/auth.js");
const { membershipAmount } = require("../utils/constants.js");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user.js");

const NOT_CONFIGURED =
  "Razorpay is not configured. Add Razorpay_KEY_ID and Razorpay_KEY_SECRET to enable checkout.";

function signaturesMatch(expected, actual) {
  if (typeof actual !== "string" || expected.length !== actual.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

async function grantMembership(payment) {
  const user = await User.findById(payment.userId);
  if (!user) {
    return null;
  }
  user.isPremium = true;
  user.membershipType = payment.notes?.membershipType || "silver";
  await user.save();
  return user;
}

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.status(503).json({ error: NOT_CONFIGURED });
    }

    const membershipType = req.body.type || req.body.membershipType;
    if (!membershipType || !membershipAmount[membershipType]) {
      return res.status(400).json({ error: "Invalid membership type: " + membershipType });
    }

    const { firstname, lastname, email } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType],
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
      notes: {
        firstname,
        lastname,
        membershipType,
      },
    });
    const savedPayment = await payment.save();

    return res.json({
      message: "Payment created and saved successfully!",
      order,
      payment: savedPayment,
      keyId: process.env.Razorpay_KEY_ID,
      plans: {
        silver: membershipAmount.silver / 100,
        gold: membershipAmount.gold / 100,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error creating payment: " + error.message });
  }
});

paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
  try {
    if (!process.env.Razorpay_KEY_SECRET) {
      return res.status(503).json({ error: NOT_CONFIGURED });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const expected = crypto
      .createHmac("sha256", process.env.Razorpay_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (!signaturesMatch(expected, razorpay_signature)) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      userId: req.user._id,
    });
    if (!payment) {
      return res.status(404).json({ error: "Order not found" });
    }

    payment.status = "captured";
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    await payment.save();

    const user = await grantMembership(payment);
    return res.json({
      message: "Payment verified",
      isUserPremium: true,
      membershipType: user?.membershipType || payment.notes?.membershipType || "silver",
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error verifying payment: " + error.message });
  }
});

async function handleWebhook(req, res) {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] || req.get("X-Razorpay-Signature");
    const webhookSecret = process.env.Razorpay_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(503).json({ error: "Razorpay webhook secret is not configured" });
    }

    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : "";
    const isWebhookvalid = validateWebhookSignature(rawBody, webhookSignature, webhookSecret);
    if (!isWebhookvalid) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    const payload = JSON.parse(rawBody);
    const paymentDetails = payload?.payload?.payment?.entity;
    if (!paymentDetails?.order_id) {
      return res.status(200).json({ msg: "Webhook ignored" });
    }

    const payment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });

    if (payment) {
      payment.status = paymentDetails.status;
      payment.paymentId = paymentDetails.id;
      await payment.save();

      if (paymentDetails.status === "captured") {
        await grantMembership(payment);
      }
    }

    return res.status(200).json({ msg: "Webhook processed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error processing webhook: " + error.message });
  }
}

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  try {
    return res.json({
      isUserPremium: Boolean(req.user.isPremium),
      membershipType: req.user.membershipType || null,
      plans: {
        silver: membershipAmount.silver / 100,
        gold: membershipAmount.gold / 100,
      },
    });
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
module.exports.handleWebhook = handleWebhook;
