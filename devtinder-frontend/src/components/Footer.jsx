import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="dt-footer">
      <span>© {new Date().getFullYear()} DevTinder</span>
      <span>Built for people who build.</span>
      <Link to="/contact">Contact</Link>
    </footer>
  );
}
