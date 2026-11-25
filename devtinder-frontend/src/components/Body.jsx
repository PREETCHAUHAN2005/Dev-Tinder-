import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(Base_Url + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }

      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className={`dt-app ${userData ? "dt-authenticated" : "dt-public"}`}>
      <a href="#main-content" className="dt-skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="dt-main" tabIndex={-1}><Outlet /></main>
      <Footer />
    </div>
  );
};

export default Body;
