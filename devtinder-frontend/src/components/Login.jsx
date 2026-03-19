import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Base_Url } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("ycombinator123@gmail.com");
  const [password, setPassword] = useState("Preetch@547y395y6");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        Base_Url + "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(
        err?.response?.data ||
          "An error occurred during login. Please try again."
      );
      console.error("Login failed:", error);
    }
  };
  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        Base_Url + "/signup",
        {
          firstname: firstName,
          lastname: lastName,
          email,
          password,
          gender,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.user));
      return navigate("/profile");
    } catch (err) {
      setError(
        err?.response?.data ||
          "An error occurred during login. Please try again."
      );
      console.error("SignUp failed:", error);
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body my-4">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login to your account" : "Create a new account"}
          </h2>
          <div className="my-4 space-evenly">
            {!isLoginForm && (
              <>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    value={firstName}
                    type="text"
                    className="input"
                    placeholder="Enter your First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    value={lastName}
                    type="text"
                    className="input"
                    placeholder="Enter your Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">Gender</legend>
                  <input
                    value={gender}
                    type="text"
                    className="input"
                    placeholder="Enter your Gender"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </fieldset>
              </>
            )}

            <fieldset className="fieldset ">
              <legend className="fieldset-legend">Email</legend>
              <input
                value={email}
                type="text"
                className="input"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>

            <label className="input validator mt-2">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                value={password}
                type="password"
                required
                placeholder="Password"
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </p>
          </div>

          <p className="text-red ">{error}</p>

          <div className="card-actions justify-center">
            <button
              className="btn btn-primary "
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign up"}{" "}
            </button>
          </div>
          <p
            className="m-auto cursor-pointer py-2"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New User? Sign Up Here"
              : "Existing User? Login Here "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
