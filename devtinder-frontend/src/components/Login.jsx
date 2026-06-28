import React from "react";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Base_Url } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const res = await axios.post(
        Base_Url + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      const errMsg = typeof err?.response?.data === "string" 
        ? err.response.data 
        : err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(errMsg);
      console.error("Login failed:", err);
    }
  };

  const handleSignUp = async () => {
    setError("");
    if (!email || !password || !firstName || !lastName || !gender) {
      setError("Please fill in all fields.");
      return;
    }
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
      const errMsg = typeof err?.response?.data === "string" 
        ? err.response.data 
        : err?.response?.data?.message || "Sign up failed. Please try again.";
      setError(errMsg);
      console.error("SignUp failed:", err);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Immersive background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="card w-full max-w-md glass-panel shadow-2xl rounded-3xl overflow-hidden border border-slate-700/50 bg-[#121620]/90 transition-all duration-300">
        <div className="card-body p-8 sm:p-10">
          {/* Brand Logo & Heading */}
          <div className="text-center mb-6">
            <span className="text-4xl font-extrabold tracking-tight bg-tinder-gradient bg-clip-text text-transparent font-Outfit">
              🔥 DevTinder
            </span>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              {isLoginForm ? "Discover & match with developer minds" : "Join the developer matchmaking space"}
            </p>
          </div>

          <div className="space-y-4">
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">First Name</label>
                  <input
                    value={firstName}
                    type="text"
                    className="w-full bg-[#1b202e] border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 text-sm"
                    placeholder="Jane"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">Last Name</label>
                  <input
                    value={lastName}
                    type="text"
                    className="w-full bg-[#1b202e] border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 text-sm"
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {!isLoginForm && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">Gender</label>
                <select
                  value={gender}
                  className="w-full bg-[#1b202e] border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 text-sm"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Other</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">Email address</label>
              <input
                value={email}
                type="email"
                className="w-full bg-[#1b202e] border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 text-sm"
                placeholder="dev@tinder.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 ml-1">Password</label>
              <input
                value={password}
                type="password"
                className="w-full bg-[#1b202e] border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-300 text-sm"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>{error.replace("Error: ", "")}</span>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <button
              className="w-full py-3 rounded-xl font-bold text-white bg-tinder-gradient hover:opacity-95 shadow-lg shadow-pink-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Log In" : "Create Account"}
            </button>

            <button
              className="w-full py-2.5 rounded-xl font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent hover:border-slate-800 transition-all duration-300 text-sm"
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setError("");
              }}
            >
              {isLoginForm ? "New to DevTinder? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
