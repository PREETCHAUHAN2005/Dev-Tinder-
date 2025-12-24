const express = require("express");
const connectDB = require("../config/database.js");
// const { userAuth } = require("./middleware/auth.js");

const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const jwt = require ("jsonwebtoken");

const { app } = require("../app");
const User = require("../models/user");
const { isLowercase } = require("validator");

// const app = express();

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // VAlidation of data
    validateSignUpData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(password, salt);
    // console.log(hash);

    // Creating a new instance of the user

    const user = new User({
      firstname,
      lastname,
      email,
      password: hash,
    });
    await user.save(); // Saving the user instance to the database
    res.send("User signed up successfully");
  } catch (error) {
    res.status(400).send("Error signing up: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Create a JWT Token

      const token = await user.getJWT();
      console.log(token);
      // Add the cookie to the server and send the response back to the server
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 + 3600000),
        httpOnly: true,
      });

      // {

      res.send("Login Succesful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .send("Logout Succesfull");
});

module.exports = authRouter;
