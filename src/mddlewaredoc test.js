
// const express = require("express");
// const app = express();
// const requestTime = function (req, res, next) {
//   req.requestTime = Date.now();
//   console.log("hi");
//   next();
// };

// const myLogger = function (req, res, next) {
//   console.log("LOGGED");
//   next();
// };

// app.use(myLogger, requestTime);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(3000);
// console.log("Example app listening on port 3000!");

// const express = require('express')
// const app = express()

// const requestTime = function (req, res, next) {
//   req.requestTime = Date.now()
//   next()
// }

// app.use(requestTime)

// app.get('/', (req, res) => {
//   let responseText = 'Hello World!<br>'
//   responseText += `<small>Requested at: ${req.requestTime}</small>`
//   res.send(responseText)
// })

// app.listen(3000)
// console.log('Example app listening on port 3000!')

const express = require("express");
const cookieParser = require("cookie-parser");
const cookieValidator = require("./middleware/cookievalidator");

const app = express();

const mw = require('./my-middleware.js')

app.use(mw({ option1: '1', option2: '2' }))


async function validateCookies(req, res, next) {
  try {
    await cookieValidator(req.cookies);
    next();
  } catch (err) {
    next(err);
  }
}

app.use(cookieParser());

app.use(validateCookies);

// error handler
app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

app.listen(3000);
console.log("Example app listening on port 3000!");
