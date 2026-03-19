const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_SECRET_KEY);
};
module.exports = connectDB;
//  connectDB().then(() => {
//   console.log("Database connected successfully");
// }).catch((err) => {
//     console.error("Database connection failed:", err);

// })
