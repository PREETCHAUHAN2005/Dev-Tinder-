const express = require("express");

const reqRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");

reqRouter.post("/sentConnectionRequest", userAuth, async (req, res, next) => {
  console.log("sending a  connection request");
  res.send("connection request sent successfully");
});
module.exports = reqRouter; 
