import Body from "./components/Body";
import Login from "./components/Login";
// import { Router } from "express"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";

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
              <Route path="/requests" element={<Requests />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:userId" element={<Chat />} />

              <Route path="/contact" element={<section className="dt-page"><div className="dt-panel dt-contact-panel"><p className="dt-eyebrow">DEVTINDER</p><h1>Contact</h1><p>Contact information will appear here when available.</p></div></section>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
      {/* <Navbar /> */}
    </>
  );
}

export default App;
