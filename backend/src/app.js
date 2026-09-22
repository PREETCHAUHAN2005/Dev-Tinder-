require("dotenv").config();
const http = require("http");
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

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.post("/payment/webhook", express.raw({ type: () => true }), handleWebhook);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

connectDB()
  .then(async () => {
    console.log("Database connected successfully");
    const indexes = await User.collection.indexes();
    const firstNameIndex = indexes.find((index) => index.name === "firstname_1");
    if (firstNameIndex?.unique) {
      await User.collection.dropIndex("firstname_1");
    }
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
