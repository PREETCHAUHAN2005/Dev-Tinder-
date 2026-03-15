const { mongoose } = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel", //reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "accepted", "rejected", "interested"],
      message: `{VALUE} is incorrect status type`,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function(next) {
  const connectionRequest = this;
  //  Checkiking if fromUserId and toUserId are the same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(" Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
