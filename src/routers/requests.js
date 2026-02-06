const express = require("express");

const reqRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { ConnectionRequest } = require("../models/connectionRequest.js");
const { message } = require("statuses");
const { User } = require("../models/user.js");

reqRouter.post(
  "/request/send/status/toUserId",
  userAuth,

  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "accepted"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type :" + status });
      }

      //  Validating user by ID

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: " User not Found" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: " Connection Request already Exists" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstname,
        data,
      });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

reqRouter.post(
  "/request/review/status/requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });

        const connectionRequest = new ConnectionRequest.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        });
        if (!connectionRequest){
          return res
            .status(404)
            .json({ message: "Connection request  not found" });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
      }
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);
module.exports = reqRouter;
