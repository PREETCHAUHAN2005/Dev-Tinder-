const express = require("express");
const app = express();
const port = 7777;

app.get("/a/bvfd", (req, res) => {
  res.send({ fname: "Preet", lname: "Chauhan" });
});
app.post("/user", (req, res) => {
  res.send("WELcome user");
});
app.delete("/user", (req, res) => {
  res.send("BYe user");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
