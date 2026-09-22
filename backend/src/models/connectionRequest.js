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

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequest = mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
