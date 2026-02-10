const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth.js");
const { User, populate } = require("../models/user.js");

const ConnectionRequests = require("../models/connectionRequest.js");
const { connection, connections } = require("mongoose");
const User_Safe_Data = "firstname lastname email";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: "interseted",
    }).populate("fromUserId", User_Safe_Data);
    // .populate("fromUserId", ["firstname", "lastname", "email");

    res.json({
      messaage: " Data fetched succesfully",
      data: ConnectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionsRequest = await ConnectionRequests.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", User_Safe_Data);

    const data = connectionsRequest.map((row) => {
      if (row.fromUserId._id.toString() === row.toUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data: connectionsRequest });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // A person shoud not see in his feed include
    // 1.Card of his own
    // card of people whom he sent request already
    // Card of people who rejected or accepted his request
    // 4.card of people who sent request to him but he rejected or acceted
    // 5.his connections



  } catch (error) {
    error.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
