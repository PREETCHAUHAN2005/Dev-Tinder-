const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const key = require("../utils/constants.js");

const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdmin = token === "xyz";
  if (!isAdmin) {
    res.status(401).send("Unauthorized Access");
    return;
  } else {
    next();
  }
};
// const UserAuth = (req, res, next) => {
//   const { token } = req.cookies;
//   const isAdmin = token === "xyz";
//   if (!isAdmin) {
//     res.status(401).send("Unauthorized Access");
//     return;
//   } else {
//     next();
//   }
// };

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies;
    if(!token){
      throw new error("Token is not valid")
    }

    const decodedObj = await jwt.verify(token, key);
    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new error("User does not exist");
    }
    next();
  } catch (err) {
    res.status(401).send("ERROR" + err.message);
    return;
  }
};
module.exports = {
  adminAuth,
  // UserAuth,
  userAuth,
};
