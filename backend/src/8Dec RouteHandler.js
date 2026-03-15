const express = require("express");
const app = express();
const port = 7777;

app.get("/user", (req, res) => {
  res.send("User route handler 2");
});


app.get("/user", (req, res) => {
  res.send("User route handler 1");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
