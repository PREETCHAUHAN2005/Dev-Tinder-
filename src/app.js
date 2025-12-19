const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user.js");
// const user = require("./models/user.js");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { key } = require("./utils/constants.js");
const { userAuth } = require("./middleware/auth.js");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    // VAlidation of data
    validateSignUpData(req);
    // const user = new User(req.body) ;

    // const { password, email } = req.body;

    //    Encrypt the password

    // const passwordHash = await bcrypt.hash(password, 10);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);

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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT Token

      const token = await jwt.sign({ _id: user._id }, key,{expiresIn:'7s'});
      console.log(token);
      // Add the cookie to the server and send the response back to the server
      res.cookie("token", token);
      res.send("Login Succesful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const cookies = req.cookies;
    // console.log(cookies);
    const { token } = cookies;
    if (!token) {
      throw new Error("No token found");
    }

    const decodedMessage = jwt.verify(token, key);
    const { _id } = decodedMessage;
    // console.log("Logged in user id is :" + _id);
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User does not exist");
    }

    // console.log(decodedMessage);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/sentConnectionRequest",userAuth, async (req, res, next) => {
  console.log("sending a  connection request");
  res.send("connection request sent successfully");
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
