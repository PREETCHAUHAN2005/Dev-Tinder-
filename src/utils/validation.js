const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstname, lastname, email, password } = req.body;
 if (!firstname || firstname.trim() === "") {
    errors.firstname = "First name is required";
  }
 
  if (!lastname || lastname.trim() === "") {
    errors.lastname = "Last name is required";
    //   }else if(firstName.length<1 || firstName.length>20){
    //     throw new Error ("First name must be between 1 and 20 characters"); // can ve handled by user.js
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address: " + email);
  }
   else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password  ");
  }
};
module.exports = {
    validateSignUpData, 
}
