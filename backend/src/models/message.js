const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });

module.exports = mongoose.model("messageModel", messageSchema);
