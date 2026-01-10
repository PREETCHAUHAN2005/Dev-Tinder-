const { default: mongoose } = require("mongoose");

const connectionReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      typr: String,
      enum: ["ignore", "accepted", "rejected", "interested"],
      message: `{VALUE} is incorrect status type`,
    },
  },
  { timestamps: true }
);

const connectionReqModel = new mongoose.model(
  "connectionReqModel",
  connectionReqSchema
);
module.exports = { connectionReqModel };
