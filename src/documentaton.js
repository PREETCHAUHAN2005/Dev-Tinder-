const express = require("express");
const app = express();

// app.get('/{ab}cd', (req, res) => {
//   res.send('ab?cd')
// }) queston mark does not support usmng braces instead

// app.get('/ab+cd', (req, res) => {
//   res.send('{ab\+cd}')
// // }) not working
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})

app.listen(7777,()=> {
    console.log("Server is running on  port 7777")
});