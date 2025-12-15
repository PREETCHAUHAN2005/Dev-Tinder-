const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user.js");
const user = require("./models/user.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    //     const user = new User({
    //  Creartng a new nstance of a user model
    // firstname: "MS",
    // lastname: "Dhon",
    // email:"preet" + Date.now() + "@chauhan.com",
    // password: "Dhon1234",
    // _id:"693be6e2db0ab756000a2ec2",
    //   });
    await user.save(); // Saving the user instance to the database
    res.send("User signed up successfully");
  } catch (error) {
    res.status(400).send("Error signing up: " + error.message);
  }
});

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
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error handler (catches errors forwarded via next(err))
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err?.message });
});

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
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
      console.log(user);
      res.send("User updated successfully");
  } catch (error) {
    res.status(400).send;
  }
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
