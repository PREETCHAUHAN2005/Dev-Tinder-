const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://preetchauhan271105_db_user:Preet20@clusterpreet1.oqnlvmd.mongodb.net/?appName=Clusterpreet1/"
  );
};
 connectDB().then(() => {
  console.log("Database connected successfully");
}).catch((err) => {
    console.error("Database connection failed:", err); 

})
