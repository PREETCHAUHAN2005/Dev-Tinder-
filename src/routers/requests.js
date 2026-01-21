const express = require("express");

const reqRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const { message } = require("statuses");

reqRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,

  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = {
        fromUserId,
        toUserId,
        status,
      };
      const data = await connectionRequest.save();
      res.json({
        message: "Connection Request Sent Succesfully",
        data,
      });
    } catch (error) {
      res.status(400).send("Error" + error.message);
    }
  }
);
module.exports = reqRouter;
