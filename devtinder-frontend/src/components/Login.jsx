import Icon from "./ui/Icon";
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
  const [submitting, setSubmitting] = useState(false);

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

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try { await (isLoginForm ? handleLogin() : handleSignUp()); }
    finally { setSubmitting(false); }
  };

  return (
    <section className="dt-auth-layout">
      <div className="dt-auth-story">
        <p className="dt-eyebrow">MEET. CONNECT. BUILD.</p>
        <h1>Your next great<br />project starts<br />with a <span>hello.</span></h1>
        <p>Find developers who share your curiosity. Make a connection. Build something together.</p>
        <div className="dt-auth-art" aria-hidden="true">
          <div className="dt-code-window">
            <div className="dt-window-controls"><i /><i /><i /><span>the-next-big-thing.js</span></div>
            <div className="dt-code-lines"><p><span>const</span> connection = {"{"}</p><p>  curiosity: <em>true</em>,</p><p>  possibilities: <em>"endless"</em>,</p><p>  startsWith: <em>"hello"</em></p><p>{"}"};</p></div>
            <div className="dt-window-footer"><Icon name="code" /><span>Better, together.</span></div>
          </div>
          <div className="dt-hello-chip"><Icon name="message" />Hey! What are you building?</div>
        </div>
      </div>
      <div className="dt-auth-card dt-panel">
        <div className="dt-auth-card-heading"><span className="dt-brand-mark"><Icon name="code" /></span><p className="dt-eyebrow">YOUR DEVELOPER COMMUNITY</p><h2>{isLoginForm ? "Good to see you." : "Let's build connections."}</h2><p>{isLoginForm ? "Log in and pick up where you left off." : "A few details, then you're ready to meet your people."}</p></div>
        <form onSubmit={submit} noValidate className="dt-form" aria-busy={submitting}>
          {!isLoginForm && <>
            <div className="dt-form-row">
              <div className="dt-field"><label htmlFor="signup-firstname">First name</label><input id="signup-firstname" value={firstName} autoComplete="given-name" placeholder="First name" onChange={(e) => setFirstName(e.target.value)} disabled={submitting} /></div>
              <div className="dt-field"><label htmlFor="signup-lastname">Last name</label><input id="signup-lastname" value={lastName} autoComplete="family-name" placeholder="Last name" onChange={(e) => setLastName(e.target.value)} disabled={submitting} /></div>
            </div>
            <div className="dt-field"><label htmlFor="signup-gender">Gender</label><select id="signup-gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={submitting}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="others">Other</option></select></div>
          </>}
          <div className="dt-field"><label htmlFor="auth-email">Email address</label><input id="auth-email" value={email} type="email" autoComplete="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(error) || undefined} aria-describedby={error ? "auth-error" : undefined} disabled={submitting} /></div>
          <div className="dt-field"><label htmlFor="auth-password">Password</label><input id="auth-password" value={password} type="password" autoComplete={isLoginForm ? "current-password" : "new-password"} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} aria-describedby={error ? "auth-error" : undefined} disabled={submitting} /></div>
          {error && <p className="dt-alert dt-alert-error" role="alert" id="auth-error"><Icon name="alert" />{error.replace("Error: ", "")}</p>}
          <button type="submit" disabled={submitting} className="dt-button dt-button-primary dt-button-full">{submitting ? "Please wait..." : isLoginForm ? "Log in" : "Create account"}<Icon name="arrow" /></button>
          <div className="dt-auth-divider"><span>{isLoginForm ? "New around here?" : "Already part of the community?"}</span></div>
          <button type="button" disabled={submitting} className="dt-button dt-button-secondary dt-button-full" onClick={() => { setIsLoginForm(!isLoginForm); setError(""); }}>{isLoginForm ? "Create an account" : "Back to log in"}</button>
        </form>
        <p className="dt-auth-caption"><Icon name="code" />A place for your kind of people.</p>
      </div>
    </section>
  );
};

export default Login;
