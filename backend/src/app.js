require("dotenv").config();
const http = require("http");
const path = require("path");
const fs = require("fs");
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routers/authroute.js");
const profileRouter = require("./routers/authProfile.js");
const reqRouter = require("./routers/requests.js");
const userRouter = require("./routers/user.js");
const paymentRouter = require("./routers/payment.js");
const { handleWebhook } = require("./routers/payment.js");
const chatRouter = require("./routers/chat.js");
const { initSocket } = require("./utils/socket.js");
const User = require("./models/user.js");

const app = express();
let indexesChecked = false;

function corsOrigin(origin, callback) {
  const configured = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  if (!origin || origin === configured) {
    callback(null, true);
    return;
  }
  try {
    if (/\.vercel\.app$/.test(new URL(origin).hostname)) {
      callback(null, true);
      return;
    }
  } catch (error) {
    callback(null, false);
    return;
  }
  callback(null, false);
}

app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(async (req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    next();
    return;
  }
  try {
    await connectDB();
    if (!indexesChecked) {
      indexesChecked = true;
      const indexes = await User.collection.indexes();
      const firstNameIndex = indexes.find((index) => index.name === "firstname_1");
      if (firstNameIndex?.unique) {
        await User.collection.dropIndex("firstname_1");
      }
    }
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.post("/payment/webhook", express.raw({ type: () => true }), handleWebhook);
app.post("/api/payment/webhook", express.raw({ type: () => true }), handleWebhook);

app.use(express.json());
app.use(cookieParser());

const apiRouters = [authRouter, profileRouter, reqRouter, userRouter, paymentRouter, chatRouter];
function mountRouters(prefix) {
  apiRouters.forEach((router) => app.use(prefix, router));
}

if (process.env.VERCEL) {
  mountRouters("/api");
} else {
  mountRouters("/");
}

const distDir = path.join(__dirname, "../../devtinder-frontend/dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
      next();
      return;
    }
    res.sendFile(path.join(distDir, "index.html"));
  });
}

if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      console.log("Database connected successfully");
      const port = process.env.PORT || 7777;
      const server = http.createServer(app);
      initSocket(server);
      server.listen(port, () => {
        console.log(`Server is running on port ${port}...`);
      });
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
    });
}

module.exports = app;
