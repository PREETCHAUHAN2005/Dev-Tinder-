const express = require("express");
const mongoose = require("mongoose");
const chatRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const Message = require("../models/message.js");
const User = require("../models/user.js");
const { getIO, roomName } = require("../utils/socket.js");

const SAFE_USER = "firstname lastname photoUrl skills";

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function findAcceptedConnection(userId, otherUserId) {
  if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
    throw httpError(400, "Invalid user id");
  }
  return ConnectionRequest.findOne({
    status: "accepted",
    $or: [
      { fromUserId: userId, toUserId: otherUserId },
      { fromUserId: otherUserId, toUserId: userId },
    ],
  });
}

async function saveChatMessage({ fromUserId, toUserId, text }) {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed || trimmed.length > 1000) {
    throw httpError(400, "Message must be between 1 and 1000 characters");
  }
  if (!mongoose.Types.ObjectId.isValid(toUserId)) {
    throw httpError(400, "Invalid user id");
  }

  const otherUser = await User.findById(toUserId).select("_id");
  if (!otherUser) {
    throw httpError(404, "User not found");
  }
  if (otherUser._id.equals(fromUserId)) {
    throw httpError(400, "You cannot message yourself");
  }

  const connection = await findAcceptedConnection(fromUserId, toUserId);
  if (!connection) {
    throw httpError(403, "You can only message accepted connections");
  }

  const message = await new Message({
    fromUserId,
    toUserId,
    text: trimmed,
  }).save();

  const io = getIO();
  if (io) {
    io.to(roomName(fromUserId, toUserId)).emit("chat:message", message.toJSON());
  }

  return message;
}

function sendChatError(res, error) {
  const status = error.statusCode || 400;
  return res.status(status).json({ message: error.message });
}

chatRouter.get("/chat", userAuth, async (req, res) => {
  try {
    const me = req.user._id;
    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: me }, { toUserId: me }],
    })
      .populate("fromUserId", SAFE_USER)
      .populate("toUserId", SAFE_USER);

    const inbox = (
      await Promise.all(
        connections.map(async (row) => {
          if (!row.fromUserId || !row.toUserId) {
            return null;
          }
          const other = row.fromUserId._id.equals(me) ? row.toUserId : row.fromUserId;
          const lastMessage = await Message.findOne({
            $or: [
              { fromUserId: me, toUserId: other._id },
              { fromUserId: other._id, toUserId: me },
            ],
          }).sort({ createdAt: -1 });
          const unreadCount = await Message.countDocuments({
            fromUserId: other._id,
            toUserId: me,
            read: false,
          });
          return { user: other, lastMessage, unreadCount };
        })
      )
    ).filter(Boolean);

    inbox.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    res.json({ data: inbox });
  } catch (error) {
    sendChatError(res, error);
  }
});

chatRouter.get("/chat/:userId", userAuth, async (req, res) => {
  try {
    const me = req.user._id;
    const otherUserId = req.params.userId;
    const connection = await findAcceptedConnection(me, otherUserId);
    if (!connection) {
      return res.status(403).json({ message: "You can only message accepted connections" });
    }

    const otherUser = await User.findById(otherUserId).select(SAFE_USER);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    let limit = parseInt(req.query.limit, 10) || 50;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { fromUserId: me, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: me },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    messages.reverse();

    await Message.updateMany(
      { fromUserId: otherUserId, toUserId: me, read: false },
      { $set: { read: true } }
    );

    const data = messages.map((message) => {
      const json = message.toJSON();
      if (String(json.toUserId) === String(me)) {
        json.read = true;
      }
      return json;
    });

    res.json({ data, user: otherUser });
  } catch (error) {
    sendChatError(res, error);
  }
});

chatRouter.post("/chat/:userId", userAuth, async (req, res) => {
  try {
    const message = await saveChatMessage({
      fromUserId: req.user._id,
      toUserId: req.params.userId,
      text: req.body.text,
    });
    res.json({ data: message });
  } catch (error) {
    sendChatError(res, error);
  }
});

module.exports = chatRouter;
module.exports.saveChatMessage = saveChatMessage;
module.exports.findAcceptedConnection = findAcceptedConnection;
