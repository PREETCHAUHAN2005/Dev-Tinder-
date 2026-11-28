import Avatar from "./ui/Avatar";
import Icon from "./ui/Icon";
import Skills from "./ui/Skills";
import { useRef, useState } from "react";
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
  const [requestError, setRequestError] = useState("");
  const gesture = useRef(null);

  const handleSendRequest = async (status, userId) => {
    if (!userId || sending) return null;
    setSending(true);
    setRequestError("");
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
      setRequestError("Your decision was not saved. Please try again.");
      setDragX(0);
      return null;
    } finally {
      setSending(false);
    }
  };

  const commitSwipe = (status) => {
    if (sending) return;
    setDragX(0);
    handleSendRequest(status, _id);
  };

  const onPointerDown = (event) => {
    if (preview || sending || !event.isPrimary || event.button !== 0) return;
    if (event.target.closest("button, summary, details, a")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const onPointerMove = (event) => {
    if (gesture.current?.id !== event.pointerId) return;
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    setDragX(Math.abs(dx) > Math.abs(dy) ? dx : 0);
  };

  const cancelDrag = (event) => {
    if (gesture.current?.id !== event.pointerId) return;
    gesture.current = null;
    setDragging(false);
    setDragX(0);
  };

  const onPointerUp = (event) => {
    const start = gesture.current;
    if (start?.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    cancelDrag(event);
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      commitSwipe(dx > 0 ? "interested" : "ignored");
    }
  };

  const likeOpacity = Math.min(Math.max(dragX / SWIPE_THRESHOLD, 0), 1);
  const passOpacity = Math.min(Math.max(-dragX / SWIPE_THRESHOLD, 0), 1);

  const fullName = `${firstname || ""} ${lastname || ""}`.trim() || "Developer";

  const details = [age, gender === "others" ? "Other" : gender].filter((value) => value != null && value !== "");

  return (
    <article className={`dt-profile-card ${preview ? "dt-profile-preview" : ""}`}
      aria-label={`${fullName}'s developer profile`}
      style={{ transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)`, transition: dragging ? "none" : "transform 0.28s ease" }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}>
      <div className="dt-profile-media">
        <Avatar src={photoUrl} name={fullName} className="dt-profile-photo" />
        {!preview && <>
          <span className="dt-swipe-stamp dt-stamp-like" style={{ opacity: likeOpacity }} aria-hidden="true">Connect</span>
          <span className="dt-swipe-stamp dt-stamp-pass" style={{ opacity: passOpacity }} aria-hidden="true">Pass</span>
        </>}
      </div>
      <div className="dt-profile-content">
        <div className="dt-profile-identity">
          <h2>{fullName}</h2>
          {details.length > 0 && <p>{details.join(" · ")}</p>}
        </div>
        {About && <p className="dt-profile-bio">{About}</p>}
        <Skills skills={skills} limit={preview ? Infinity : 4} />
        {!preview && <>
          {requestError && <p className="dt-alert dt-alert-error" role="alert">{requestError}</p>}
          <div className="dt-profile-actions" aria-label="Profile actions">
            <button className="dt-decision dt-decision-pass" type="button" onClick={() => commitSwipe("ignored")} disabled={sending} aria-label={`Pass on ${firstname}`} title="Pass"><Icon name="close" /><span>Pass</span></button>
            <button className="dt-decision dt-decision-like" type="button" onClick={() => commitSwipe("interested")} disabled={sending} aria-label={`Connect with ${firstname}`} title="Send connection request"><Icon name="plus" /><span>Connect</span></button>
          </div>
          {sending && <p className="dt-sr-only" role="status">Saving your choice…</p>}
        </>}
      </div>
    </article>
  );
};

export default UserCard;
