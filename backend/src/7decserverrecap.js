const express = require("express");
const app = express();


// app.use("/route",[rh1,rh2 ,rh3, rh4])
// app.use("/route",rh1,rh2 ,rh3, [rh4])
// app.use("/route",[rh1,rh2] ,rh3, rh4)

// Gives Same Result


app.use("/hello", [
  (req, res, next) => {
    // res .send("Hello Preet!");
    console.log("Someone accessed /hello endpoint");
    next();
    // res.send("Hello Preet!");
  },
  (req, res, next) => {
    console.log("This is the second middleware for /hello");
    next();
    // res.send("Second route handler");
  },
  (req, res, next) => {
    console.log("This is the 3 middleware for /hello");
    next();
    // res.send("Second route handler");
  },
  (req, res, next) => {
    console.log("This is the 4 middleware for /hello");
    next();
    res.send("Fifth route handler");
  },
]);

app.listen(7777, () => {
  console.log("Server is running on  port 7777");
});
