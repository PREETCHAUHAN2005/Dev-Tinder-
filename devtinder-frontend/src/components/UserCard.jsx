import Avatar from "./ui/Avatar";
import Icon from "./ui/Icon";
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

  const fullName = `${firstname || ""} ${lastname || ""}`.trim() || "Developer";

  return (
    <article className={`dt-profile-card ${preview ? "dt-profile-preview" : ""}`}
      aria-label={`${fullName}'s developer profile`}
      style={{ transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)`, transition: dragging ? "none" : "transform 0.28s ease" }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
      <div className="dt-profile-media">
        <Avatar src={photoUrl} name={fullName} className="dt-profile-photo" />
        <div className="dt-profile-shade" />
        <span className="dt-profile-label"><Icon name="code" />Developer profile</span>
        {!preview && <>
          <span className="dt-swipe-stamp dt-stamp-like" style={{ opacity: likeOpacity }} aria-hidden="true">LIKE</span>
          <span className="dt-swipe-stamp dt-stamp-pass" style={{ opacity: passOpacity }} aria-hidden="true">PASS</span>
        </>}
        <div className="dt-profile-identity">
          <h2>{fullName}{age && <span>{age}</span>}</h2>
          {gender && <p>{gender}</p>}
        </div>
      </div>
      <div className="dt-profile-content">
        <p className="dt-profile-bio">{About || "A developer worth getting to know. No bio added yet."}</p>
        {skills && skills.length > 0 && <div className="dt-skills">
          {skills.slice(0, 4).map((skill, index) => <span key={index}>{String(skill)}</span>)}
          {skills.length > 4 && <span className="dt-skills-more">+{skills.length - 4} more</span>}
        </div>}
        {!preview && <>
          {requestError && <p className="dt-alert dt-alert-error" role="alert">{requestError}</p>}
          <div className="dt-profile-actions" aria-label="Profile actions">
            <button className="dt-decision dt-decision-pass" type="button" onClick={() => commitSwipe("ignored")} disabled={sending} aria-label={`Pass on ${firstname}`} title="Pass"><Icon name="close" /><span>Pass</span></button>
            <span className="dt-decision-hint" role="status">{sending ? "Saving..." : "Your next connection?"}</span>
            <button className="dt-decision dt-decision-like" type="button" onClick={() => commitSwipe("interested")} disabled={sending} aria-label={`Like ${firstname}`} title="Like"><Icon name="heart" /><span>Like</span></button>
          </div>
        </>}
      </div>
    </article>
  );
};

export default UserCard;
