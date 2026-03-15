const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://preetchauhan271105_db_user:yoI1dPJWCo9sqN42@dev.qsovvuh.mongodb.net/Dev"
  );
};
module.exports = connectDB;
//  connectDB().then(() => {
//   console.log("Database connected successfully");
// }).catch((err) => {
//     console.error("Database connection failed:", err);

// })
