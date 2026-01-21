const { mongoose } = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
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

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //  Checkiking if fromUserId and toUserId are the same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new error(" Cannot send connection request to yourself");
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);
module.exports = { connectionRequestModel };
