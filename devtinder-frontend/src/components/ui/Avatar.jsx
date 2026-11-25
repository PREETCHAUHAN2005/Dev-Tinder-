import { useState } from "react";

export default function Avatar({ src, name = "Developer", className = "", decorative = false }) {
  const [failedSource, setFailedSource] = useState("");
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "D";
  return (
    <span className={`dt-avatar ${className}`} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : `${name} profile photo`} aria-hidden={decorative || undefined}>
      <span className="dt-avatar-initials">{initials}</span>
      {src && failedSource !== src && <img src={src} alt="" onError={() => setFailedSource(src)} draggable="false" />}
    </span>
  );
}
