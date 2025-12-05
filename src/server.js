const express = require("express");
const app = express();
const port = 7777;

app.get("/user", (req, res) => {
  res.send({fname:"Preet", lname:"Chauhan"});
});
app.post("/user", (req, res) => {
  res.send("WELcome user");
});
app.delete("/user", (req, res) => {
  res.send("BYe user")   ;
});

// app.use("/test/2", (req, res) => {
//   res.send("Aabrra a dabra!");
// });
// ths wll match all the http method api calls /hello


app.use("/test", (req, res) => {
  res.send("WElcome Test!");
});
// app.use("/", (req, res) => {
//   res.send("Welcome home!");
// });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
    