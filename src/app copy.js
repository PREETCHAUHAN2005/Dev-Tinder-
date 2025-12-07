const express = require("express");
const app = express();

app.get('/random.text', (req, res) => {
  res.send('random.text')
})


app.listen(7777,()=> {
    console.log("Server is running on  port 7777")
});
