const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { key } = require("../utils/constants");
const jwt = require("jsonwebtoken");
const { message } = require("statuses");
const { schema } = mongoose;
const User = require("./user.js");
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      // unique: true,
      index: true,
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
      required: true,
      enum: ["male", "female", "others"],
      message: `{VALUE} is not supported`,
    },
    // gender: {
    //   type: String,
    //   validate(value) {
    //     if (!["male", "female", "others"].includes(value)) {
    //       throw new Error("Gender data is not valid");
    //     }
    // },+

    // },
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
// User.find({ firstName: "Preet", lastName: "Chauhan" });
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function() {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, key, { expiresIn: "7d" });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("userModel", userSchema);
