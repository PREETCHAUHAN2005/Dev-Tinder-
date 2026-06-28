import React, { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addfeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const currentUser = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get(Base_Url + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addfeed(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!feed) {
      getFeed();
    }
  }, []);

  if (loading || !feed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <div className="radar-wave"></div>
          <div className="radar-wave-delayed"></div>
          <div className="w-16 h-16 rounded-full border border-[#3444DA]/50 p-0.5 z-10 shadow-lg bg-[#16161a]">
            <img
              src={currentUser?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-full h-full rounded-full object-cover animate-pulse"
              alt="Searching avatar"
            />
          </div>
        </div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
          Locating nearby developers...
        </p>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-6">
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <div className="radar-wave"></div>
          <div className="w-16 h-16 rounded-full border border-[#3444DA]/50 p-0.5 z-10 shadow-lg bg-[#16161a]">
            <img
              src={currentUser?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-full h-full rounded-full object-cover"
              alt="Searching avatar"
            />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white font-Outfit">No New Developers Found</h2>
        <p className="text-[#94A3B8] mt-2 text-xs max-w-xs leading-relaxed">
          You've swiped on everyone in your area. Check back later or expand your profile settings to get matches!
        </p>
        <button
          onClick={getFeed}
          className="mt-6 px-6 py-2.5 rounded-full font-bold bg-white text-black hover:bg-slate-200 transition-all duration-300 cursor-pointer text-xs uppercase tracking-wider shadow-md"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[75vh] py-6 px-4">
      <div className="relative w-full max-w-sm animate-fade-in">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
