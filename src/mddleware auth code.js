const express = require("express");
const app = express();

const { adminAuth, UserAuth } = require("./middleware/auth");
// GET /hello=> Middleware chan => request handler

// HAndle auth mddleware for all

app.use("/Admin",adminAuth);

app.use("/user/login", (req, res) => {
  res.send("User Login");
});
// app.use("/User", UserAuth);
app.get("/user", UserAuth, (req, res, next) => {
    const token = "xyz";
    const isAdmin = token === "xyz";
    if (!isAdmin) {
      res.status(401).send("Unauthorized Access");
      return;
    } else {
      next();
    }

  res.send("Gettng the data for User");
});
app.get("/Admin/getAllData", (req, res) => {
  res.send("Gettng the data for Admin");
});
app.get("/Admin/delete", (req, res) => {
  res.send(" Deleting the data for User");
});
app.listen(7777, () => {
  console.log("Server is running     on  port 7777");
});
