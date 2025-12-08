const express = require("express");
const app = express();
app.get("/userData", (req, res) => 
   {
    try{throw new error("abcerf3re")
  res.send("Getting user data");}
    

catch (err) {
  res.status(500).send("Internal Server Error");
}
}
);

app.use("/",(req,res,err,next)=>{
    console.log("This is middleware for all routes");
    if(err){
        res.status(500).send("Internal Server Error from middleware");
    }
})
app.listen(7777, () => {
  console.log("Server is running     on  port 7777");
});
