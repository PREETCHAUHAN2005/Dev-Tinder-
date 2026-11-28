import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="dt-footer">
      <span>© {new Date().getFullYear()} DevTinder</span>
      <Link to="/contact">Contact</Link>
    </footer>
  );
}
