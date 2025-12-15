const mongoose = require("mongoose");
// const {schema} = mongoose
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,

  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  age:{
    type: Number,

  },
  gender:{
    type: String,

  },
  photoUrl:{
    type: String,
    default:""

  },
  About:{
    type: String,
    default: "Hello! I am using DevTinder."

  } ,
  skills:{
    type: [String],
  }
  


}); 

module.exports = mongoose.model("userModel", userSchema);
