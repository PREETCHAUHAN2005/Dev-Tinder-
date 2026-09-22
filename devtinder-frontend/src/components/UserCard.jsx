import React, { useRef, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const SWIPE_THRESHOLD = 120;

const UserCard = ({ user, preview = false, onDecision }) => {
  const { _id, firstname, lastname, photoUrl, age, gender, About, skills } = user;
  const dispatch = useDispatch();
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const dragRef = useRef(0);
  const draggingRef = useRef(false);
  const startX = useRef(0);

  const updateDrag = (value) => {
    dragRef.current = value;
    setDragX(value);
  };

  const handleSendRequest = async (status, userId) => {
    if (!userId || sending) return null;
    setSending(true);
    try {
      const res = await axios.post(
        Base_Url + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
      if (onDecision) onDecision(res.data);
      return res.data;
    } catch (error) {
      console.error("Error sending request:", error);
      updateDrag(0);
      return null;
    } finally {
      setSending(false);
    }
  };

  const commitSwipe = (status) => {
    updateDrag(status === "interested" ? 520 : -520);
    handleSendRequest(status, _id);
  };

  const onPointerDown = (event) => {
    if (preview || sending) return;
    if (event.target.closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startX.current = event.clientX;
    draggingRef.current = true;
    setDragging(true);
  };

  const onPointerMove = (event) => {
    if (!draggingRef.current) return;
    updateDrag(event.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (dragRef.current > SWIPE_THRESHOLD) {
      commitSwipe("interested");
      return;
    }
    if (dragRef.current < -SWIPE_THRESHOLD) {
      commitSwipe("ignored");
      return;
    }
    updateDrag(0);
  };

  const likeOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);

  return (
    <div
      className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative bg-[#16161a] border border-slate-800/80 min-h-[520px] flex flex-col justify-end select-none touch-none"
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)`,
        transition: dragging ? "none" : "transform 0.28s ease",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {!preview && (
        <>
          <div
            className="absolute top-8 left-6 z-20 px-3 py-1 rounded-md border-2 border-emerald-400 text-emerald-300 font-black tracking-widest text-sm"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </div>
          <div
            className="absolute top-8 right-6 z-20 px-3 py-1 rounded-md border-2 border-rose-400 text-rose-300 font-black tracking-widest text-sm"
            style={{ opacity: passOpacity }}
          >
            PASS
          </div>
        </>
      )}

      <div className="absolute inset-0 w-full h-[78%] overflow-hidden rounded-t-2xl">
        <img
          src={photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt={`${firstname} photo`}
          className="w-full h-full object-cover object-center"
          draggable="false"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 card-gradient-overlay"></div>
      </div>

      <div className="z-10 p-6 pt-0 bg-gradient-to-t from-[#16161a] via-[#16161a] to-[#16161a]/20 rounded-b-2xl">
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

        {gender && (
          <div className="mb-3">
            <span className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-[#09090B] text-slate-400 border border-slate-800">
              {gender}
            </span>
          </div>
        )}

        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
          {About || "No bio description provided."}
        </p>

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-[9px] uppercase tracking-wider font-semibold bg-[#212124] text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md"
              >
                {String(skill).toLowerCase()}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[9px] font-semibold text-slate-500 self-center">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {!preview && (
          <div className="flex justify-center items-center gap-6 pt-2">
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1d1d22] border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/35 transition-all duration-300 cursor-pointer shadow-md active:scale-90"
              onClick={() => commitSwipe("ignored")}
              title="Pass"
              type="button"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            <button
              className="w-14 h-14 rounded-full flex items-center justify-center bg-[#3444DA] text-white hover:bg-[#2B39B8] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-micro1-active hover:scale-105 active:scale-95"
              onClick={() => commitSwipe("interested")}
              title="Like"
              type="button"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
