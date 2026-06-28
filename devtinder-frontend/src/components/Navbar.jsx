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
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar sticky top-0 z-50 bg-[#09090B]/85 backdrop-blur-md border-b border-slate-800/40 px-6 py-3 transition-all duration-300 mb-6">
      {/* Brand Logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="flex items-center gap-1 hover:opacity-85 transition-opacity"
        >
          <span className="text-xl font-bold tracking-tight text-white font-Outfit lowercase">
            devtinder<span className="text-[#3444DA] font-extrabold font-Outfit text-2xl">.</span>
          </span>
        </Link>
      </div>

      {/* Right Side Section */}
      <div className="flex gap-4 items-center">
        {user && (
          <div className="flex items-center gap-5">
            {/* Welcome Text */}
            <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase hidden md:block">
              Welcome, <span className="text-slate-100 font-bold">{user.firstname}</span>
            </span>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-slate-800 hover:border-[#3444DA] p-[2px] transition-all duration-300 shadow-lg"
              >
                <div className="w-8 rounded-full overflow-hidden">
                  <img
                    alt="user profile"
                    src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-52 p-2 shadow-2xl rounded-xl border border-slate-800/70 bg-[#121214] z-[1]"
              >
                <li>
                  <Link to="/profile" className="flex justify-between items-center py-2.5 px-3 hover:bg-slate-800/60 rounded-lg text-slate-300">
                    <span>Profile Settings</span>
                    <span className="badge badge-sm bg-[#3444DA] text-white border-none text-[9px] uppercase tracking-wider px-1.5 py-0.5">Edit</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="py-2.5 px-3 hover:bg-slate-800/60 rounded-lg text-slate-300">
                    My Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="py-2.5 px-3 hover:bg-slate-800/60 rounded-lg text-slate-300">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="py-2.5 px-3 hover:bg-slate-800/60 rounded-lg text-amber-500 font-semibold flex items-center gap-1">
                    👑 Premium
                  </Link>
                </li>
                <div className="divider my-1 border-slate-800/50"></div>
                <li>
                  <a onClick={handleLogout} className="py-2.5 px-3 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg">
                    Logout
                  </a>
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

