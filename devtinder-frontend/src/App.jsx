import Body from "./components/Body";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
// import { Router } from "express"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/login" element={<Login />} />
             <Route path="/profile" element={<Profile />} />
          </Route>
          {/* <Route path="/about" element={<h1>About Page</h1>} />
    <Route path="/contact" element={<h1>Contact Page</h1>} /> */}
        </Routes>
      </BrowserRouter>
      {/* <Navbar /> */}
    </>
  );
}

export default App;
