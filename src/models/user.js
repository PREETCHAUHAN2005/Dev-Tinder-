const mongoose = require("mongoose");
const validator = require("validator");
// const {schema} = mongoose
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      // unique: true,
      minlength: 5,
      maxlength: 20,
    },
    lastname: {
      type: String,
      required: true,
      // unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,

      validate(value) {
        if (!validator.isURL(value)) {
          throw new error("Invalid Photo address: " + value);
        }
      },
    },
    About: {
      type: String,
      default: "Hello! I am using DevTinder.",
    },
    skills: {
      type: [String],
      default: ["node.js", "react.js", "mongoDB"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userModel", userSchema);
