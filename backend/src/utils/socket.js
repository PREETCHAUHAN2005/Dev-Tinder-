const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { key } = require("./constants.js");

let io = null;

function roomName(userIdA, userIdB) {
  return ["chat", ...[String(userIdA), String(userIdB)].sort()].join(":");
}

function getIO() {
  return io;
}

function readCookie(cookieHeader, name) {
  if (!cookieHeader) {
    return null;
  }
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = readCookie(socket.handshake.headers.cookie, "token");
      if (!token || !key) {
        return next(new Error("Unauthorized"));
      }
      const decoded = jwt.verify(token, key);
      const user = await User.findById(decoded._id);
      if (!user) {
        return next(new Error("Unauthorized"));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("chat:join", async (payload = {}, ack) => {
      try {
        const { findAcceptedConnection } = require("../routers/chat.js");
        const otherUserId = payload.userId;
        const connection = await findAcceptedConnection(socket.user._id, otherUserId);
        if (!connection) {
          if (typeof ack === "function") {
            ack({ error: "You can only message accepted connections" });
          }
          return;
        }
        socket.join(roomName(socket.user._id, otherUserId));
        if (typeof ack === "function") {
          ack({ ok: true });
        }
      } catch (error) {
        if (typeof ack === "function") {
          ack({ error: error.message || "Unable to join chat" });
        }
      }
    });

    socket.on("chat:send", async (payload = {}, ack) => {
      try {
        const { saveChatMessage } = require("../routers/chat.js");
        const message = await saveChatMessage({
          fromUserId: socket.user._id,
          toUserId: payload.toUserId,
          text: payload.text,
        });
        if (typeof ack === "function") {
          ack({ ok: true, data: message });
        }
      } catch (error) {
        if (typeof ack === "function") {
          ack({ error: error.message, status: error.statusCode || 400 });
        }
      }
    });
  });

  return io;
}

module.exports = {
  initSocket,
  getIO,
  roomName,
};
