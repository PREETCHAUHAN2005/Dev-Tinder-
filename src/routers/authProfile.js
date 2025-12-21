const express = require("express");
const connectDB = require("../config/database");
const User = require("../models/user");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const jwt = require("jsonwebtoken");
const { key } = require("../utils/constants.js");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) { 
      throw new Error("No token found");
    }

    const decodedMessage = jwt.verify(token, key);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User does not exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;