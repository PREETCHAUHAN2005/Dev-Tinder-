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

  // Collaboration photograph by Annie Spratt on Unsplash, QckxruozjRg.
  const photo = "https://images.unsplash.com/photo-1522071820081-009f0129c71c";
  const imageAt = (width) => photo + "?auto=format&fit=crop&q=75&w=" + width;

  return (
    <section className="dt-auth-layout">
      <div className="dt-auth-card">
        <header className="dt-auth-card-heading">
          <h1>{isLoginForm ? "Welcome back." : "Join DevTinder."}</h1>
          <p>{isLoginForm ? "Log in to meet developers and pick up your conversations." : "Create an account to meet other developers."}</p>
        </header>
        <form onSubmit={submit} noValidate className="dt-form" aria-busy={submitting}>
          {!isLoginForm && <>
            <div className="dt-form-row">
              <div className="dt-field"><label htmlFor="signup-firstname">First name</label><input id="signup-firstname" value={firstName} autoComplete="given-name" placeholder="First name" onChange={(e) => setFirstName(e.target.value)} disabled={submitting} /></div>
              <div className="dt-field"><label htmlFor="signup-lastname">Last name</label><input id="signup-lastname" value={lastName} autoComplete="family-name" placeholder="Last name" onChange={(e) => setLastName(e.target.value)} disabled={submitting} /></div>
            </div>
            <div className="dt-field"><label htmlFor="signup-gender">Gender</label><select id="signup-gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={submitting}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="others">Other</option></select></div>
          </>}
          <div className="dt-field"><label htmlFor="auth-email">Email address</label><input id="auth-email" value={email} type="email" autoComplete="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} aria-describedby={error ? "auth-error" : undefined} disabled={submitting} /></div>
          <div className="dt-field"><label htmlFor="auth-password">Password</label><input id="auth-password" value={password} type="password" autoComplete={isLoginForm ? "current-password" : "new-password"} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} aria-describedby={[!isLoginForm && "password-hint", error && "auth-error"].filter(Boolean).join(" ") || undefined} disabled={submitting} />
            {!isLoginForm && <small id="password-hint">At least 8 characters, including uppercase, lowercase, a number, and a symbol.</small>}
          </div>
          {error && <p className="dt-alert dt-alert-error" role="alert" id="auth-error"><Icon name="alert" />{error.replace("Error: ", "")}</p>}
          <button type="submit" disabled={submitting} className="dt-button dt-button-primary dt-button-full">{submitting ? (isLoginForm ? "Logging in…" : "Creating account…") : isLoginForm ? "Log in" : "Create account"}<Icon name="arrow" /></button>
          <div className="dt-auth-switch"><span>{isLoginForm ? "New to DevTinder?" : "Already a member?"}</span>{" "}
          <button type="button" disabled={submitting} className="dt-text-button" onClick={() => { setIsLoginForm(!isLoginForm); setError(""); }}>{isLoginForm ? "Create an account" : "Back to log in"}</button></div>
        </form>
      </div>
      <div className="dt-auth-story">
        <img className="dt-story-photo" src={imageAt(960)} alt="" width="960" height="880" loading="lazy" decoding="async"
          srcSet={[480, 768, 960, 1440].map((w) => imageAt(w) + " " + w + "w").join(", ")}
          sizes="(max-width: 760px) 100vw, (max-width: 1200px) 54vw, 650px"
          onError={(event) => { event.currentTarget.hidden = true; }} />
        <div className="dt-story-copy">
          <h2>Find your next <em>collaborator.</em></h2>
          <p>Get to know the people behind the projects you’d like to build.</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
