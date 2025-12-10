const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user.js");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      //  Creartng a new nstance of a user model
      firstname: "Preet",
      lastname: "Chauhan",
      email:"preet" + Date.now() + "@chauhan.com",
      password: "preet1234",
    });
    await user.save(); // Saving the user instance to the database
    res.send("User signed up successfully");
  } catch (error) {
    res.status(400).send("Error signing up: " + error.message);
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
