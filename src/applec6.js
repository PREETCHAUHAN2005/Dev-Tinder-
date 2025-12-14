app.post("/signup", async (req, res) => {
  
    try {
      const user = new User(req.body);
const user = new User({
//    Creartng a new nstance of a user model
  firstname: "MS",
  lastname: "Dhon",
  email:"preet" + Date.now() + "@chauhan.com",
  password: "Dhon1234",
  _id:"693be6e2db0ab756000a2ec2",
    });
    await user.save(); // Saving the user instance to the database
    res.send("User signed up successfully");
  } catch (error) {
    res.status(400).send("Error signing up: " + error.message);
  }
});
