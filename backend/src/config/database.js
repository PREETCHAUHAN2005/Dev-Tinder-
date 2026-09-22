const mongoose = require("mongoose");

let connecting;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connecting) {
    connecting = mongoose.connect(process.env.DATABASE_SECRET_KEY).catch((error) => {
      connecting = null;
      throw error;
    });
  }
  return connecting;
};
module.exports = connectDB;
//  connectDB().then(() => {
//   console.log("Database connected successfully");
// }).catch((err) => {
//     console.error("Database connection failed:", err);

// })
