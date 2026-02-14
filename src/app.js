const express = require("express");
const connectDB = require("./config/database");
const app = express();
exports.app = app;
const User = require("./models/user.js");

// const user = require("./models/user.js");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { key } = require("./utils/constants.js");

const authRouter = require("./routers/authroute.js");
const profileRouter = require("./routers/authProfile.js");
const reqRouter = require("./routers/requests.js");
const { connectionRequest } = require("./models/connectionRequest.js");
const userRouter = require("./routers/user.js");
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", reqRouter);
app.use("/", userRouter);

app.get("/user", async (req, res) => {
  // Expect email to be provided as a query parameter (e.g. /user?email=foo@bar.com)
  const userEmail = req.query.email || req.body.email;

  if (!userEmail) {
    return res
      .status(400)
      .json({ error: "Please provide ?email=<email> as query parameter" });
  }

  try {
    const users = await User.findOne({ email: userEmail }).exec();
    if (!users) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    // Log the full error on the server so we can see stack traces in logs
    console.error("Error in GET /user:", error);
    return res
      .status(500)
      .json({ error: "Error fetching user: " + error.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    // Log the full error on the server so we can see stack traces in logs
    console.error("Error in GET /feed:", error);
    return res
      .status(500)
      .json({ error: "Error fetching feed: " + error.message });
  }
});

// Health check endpoint

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("USEr  deleted successfully");
  } catch (error) {
    res.status(400).send("Error deleting user: " + error.message);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "firstname",
      "lastname",
      "email",
      "password",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed");
      if (data?.skills.length > 10) {
        throw new Error("Skills cannot be more than 10");
      }
    }
  } catch (error) {
    console.log("error");
  }

  // try {
  //   const user = await User.findByIdAndUpdate({ _id: userId }, data, {
  //     returnDocument: "after",
  //     runValidators: true,
  //   });
  //     console.log(user);
  //     res.send("User updated successfully");
  // } catch (error) {
  //   res.status(400).send("Update Failed: " + error.message);
  // }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on  port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
