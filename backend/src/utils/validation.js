const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || firstname.trim() === "") {
    throw new Error("First name is required");
  }

  if (!lastname || lastname.trim() === "") {
    throw new Error("Last name is required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address: " + email);
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password  ");
  }
};

const validateEditProfiledata = (req) => {
  const allowedEditFields = [
    "firstname",
    "lastname",

    "gender",
    "age",
    "About",
    "skills",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfiledata,
};
