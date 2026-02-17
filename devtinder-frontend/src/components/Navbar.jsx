import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Base_Url } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(Base_Url + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (error) {
      Error("Logout failed:", error);
    }
  };

  return (
    // 1. Added px-6 for side padding and shadow-lg for depth
    <div className="navbar bg-base-300 shadow-lg px-4 sm:px-6">
      {/* Brand Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-xl sm:text-2xl font-bold text-primary"
        >
          DevTinder
        </Link>
      </div>

      {/* Right Side Section */}
      <div className="flex gap-4 items-center">
        {" "}
        {/* 2. items-center aligns everything vertically */}
        {/* Search - Hidden on very small screens to save space */}
        {user && (
          <div className="form-control hidden sm:block">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto h-10"
            />
          </div>
        )}
        {user && (
          <div className="flex items-center gap-3">
            {/* Welcome Text - Now separate from dropdown for better alignment */}
            <span className="text-base font-medium hidden md:block">
              Welcome, {user.firstname}
            </span>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-primary/20"
              >
                <div className="w-10 rounded-full">
                  <img alt="user profile" src={user.photoUrl} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge badge-accent">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
