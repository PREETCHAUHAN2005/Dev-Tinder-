import React, { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addfeed } from "../utils/feedSlice";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const currentUser = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);

  const getFeed = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(Base_Url + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addfeed(res?.data?.data || []));
    } catch (err) {
      console.error("Failed to fetch feed:", err);
      setError("Could not load developers. Check that you are logged in and the API is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!feed) {
      getFeed();
    }
  }, []);

  if (loading || (!feed && !error)) {
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

  if (error && !feed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-6">
        <h2 className="text-xl font-bold text-white font-Outfit">Feed unavailable</h2>
        <p className="text-[#94A3B8] mt-2 text-xs max-w-xs leading-relaxed">{error}</p>
        <button
          onClick={getFeed}
          className="mt-6 px-6 py-2.5 rounded-full font-bold bg-white text-black hover:bg-slate-200 transition-all duration-300 cursor-pointer text-xs uppercase tracking-wider shadow-md"
          type="button"
        >
          Try again
        </button>
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
          type="button"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  const top = feed[0];

  return (
    <div className="flex justify-center items-center min-h-[75vh] py-6 px-4">
      <div className="relative w-full max-w-sm min-h-[540px] animate-fade-in">
        {feed[1] && (
          <div className="absolute inset-x-0 top-3 scale-95 opacity-60 pointer-events-none">
            <UserCard user={feed[1]} preview />
          </div>
        )}
        <div className="relative z-10">
          <UserCard
            key={top._id}
            user={top}
            onDecision={(data) => {
              if (typeof data?.message === "string" && data.message.includes("It's a Match")) {
                setMatch(top);
              }
            }}
          />
        </div>
      </div>

      {match && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center px-6">
          <div className="glass-panel max-w-sm w-full rounded-3xl p-8 text-center border border-[#3444DA]/40">
            <p className="text-[#8ea0ff] text-xs font-bold uppercase tracking-[0.2em]">It's a match</p>
            <h2 className="text-3xl font-extrabold text-white font-Outfit mt-3">
              You and {match.firstname} connected
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              You both want to connect. Say hello, or keep meeting developers.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <Link
                to={`/chat/${match._id}`}
                className="py-3 rounded-full bg-[#3444DA] text-white font-bold"
                onClick={() => setMatch(null)}
              >
                Message
              </Link>
              <button
                type="button"
                className="py-3 rounded-full border border-slate-700 text-slate-200 font-semibold"
                onClick={() => setMatch(null)}
              >
                Keep swiping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
