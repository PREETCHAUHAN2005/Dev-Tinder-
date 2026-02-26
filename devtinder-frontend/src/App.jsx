import Body from "./components/Body";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
// import { Router } from "express"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
            </Route>
            <Route path="/requests" element={<Requests />} />

            <Route path="/contact" element={<h1>Contact Page</h1>} />
          </Routes>
        </BrowserRouter>
      </Provider>
      {/* <Navbar /> */}
    </>
  );
}

export default App;
