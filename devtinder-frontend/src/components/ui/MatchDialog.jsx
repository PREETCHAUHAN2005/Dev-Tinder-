import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import Icon from "./Icon";

export default function MatchDialog({ match, currentUser, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll("a[href], button:not([disabled])")];
    focusable()[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const controls = focusable();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div className="dt-modal-backdrop">
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="match-title" aria-describedby="match-description" className="dt-match-dialog">
        <button type="button" className="dt-icon-button dt-modal-close" aria-label="Close match confirmation" onClick={onClose}><Icon name="close" /></button>
        <div className="dt-match-avatars">
          <Avatar src={currentUser?.photoUrl} name={currentUser?.firstname} />
          <span className="dt-match-heart"><Icon name="heart" /></span>
          <Avatar src={match.photoUrl} name={match.firstname} />
        </div>
        <h2 id="match-title">It's a match.</h2>
        <p id="match-description">You and {match.firstname} can now message each other.</p>
        <Link to={`/chat/${match._id}`} className="dt-button dt-button-primary" onClick={onClose}>Send a message <Icon name="message" /></Link>
        <button type="button" className="dt-button dt-button-quiet" onClick={onClose}>Keep discovering</button>
      </section>
    </div>
  );
}
