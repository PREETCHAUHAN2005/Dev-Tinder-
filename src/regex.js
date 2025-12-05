const express = require("express");
const app = express();
const port = 7777;

app.get(/.*fly$/, (req, res) => {
  res.send({ fname: "Preet", lname: "Chauhan" });
});
app.get("/user/:userId", (req, res) => {
  console.log(req.params); 
  res.send({ fname: "Preet", lname: "Chauhan" });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})