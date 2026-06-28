import React from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstname, lastname, photoUrl, age, gender, About, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        Base_Url + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative bg-[#16161a] border border-slate-800/80 min-h-[520px] flex flex-col justify-end group transition-all duration-300 hover:shadow-micro1-glow hover:-translate-y-1">
      {/* User Portrait Backdrop */}
      <div className="absolute inset-0 w-full h-[78%] overflow-hidden rounded-t-2xl">
        <img
          src={photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt={`${firstname} photo`}
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-all duration-500"
        />
        {/* Soft bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 card-gradient-overlay"></div>
      </div>

      {/* Glassmorphic User Info Drawer */}
      <div className="z-10 p-6 pt-0 bg-gradient-to-t from-[#16161a] via-[#16161a] to-[#16161a]/20 rounded-b-2xl">
        
        {/* Header (Name & Age) */}
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="text-2xl font-bold text-white font-Outfit tracking-tight">
            {firstname} {lastname}
          </h2>
          {age && (
            <span className="text-lg font-medium text-slate-400 font-Outfit">
              {age}
            </span>
          )}
        </div>

        {/* Gender Badge */}
        {gender && (
          <div className="mb-3">
            <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-[#09090B] text-slate-400 border border-slate-800">
              {gender}
            </span>
          </div>
        )}

        {/* About Text */}
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
          {About || "No bio description provided."}
        </p>

        {/* Skills Tag Cloud */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-[9px] uppercase tracking-wider font-semibold bg-[#212124] text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md"
              >
                {skill.toLowerCase()}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[9px] font-semibold text-slate-500 self-center">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Swiper Action Buttons */}
        <div className="flex justify-center items-center gap-6 pt-2">
          {/* Ignore Button */}
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1d1d22] border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/35 transition-all duration-300 cursor-pointer shadow-md active:scale-90"
            onClick={() => handleSendRequest("ignored", _id)}
            title="Pass"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          {/* Interested Button */}
          <button
            className="w-13 h-13 rounded-full flex items-center justify-center bg-[#3444DA] text-white hover:bg-[#2B39B8] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-micro1-active hover:scale-105 active:scale-95"
            onClick={() => handleSendRequest("interested", _id)}
            title="Like"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserCard;
