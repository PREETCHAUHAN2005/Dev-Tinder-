import Icon from "./ui/Icon";
import Avatar from "./ui/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { Base_Url } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { clearFeed } from "../utils/feedSlice";
import { removeConnection } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(Base_Url + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(clearFeed());
      dispatch(removeConnection());
      dispatch(clearRequests());
      return navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = [
    { to: "/", label: "Discover", icon: "discover" },
    { to: "/connections", label: "Connections", icon: "people" },
    { to: "/requests", label: "Requests", icon: "inbox" },
    { to: "/chat", label: "Messages", icon: "message" },
    { to: "/profile", label: "My profile", icon: "user" },
  ];
  const navigation = (mobile = false) => (
    <nav className={mobile ? "dt-mobile-navigation" : "dt-navigation"} aria-label={mobile ? "Mobile navigation" : "Main navigation"}>
      {links.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `dt-nav-link ${isActive ? "dt-nav-active" : ""}`}>
          <Icon name={icon} /><span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      <header className={user ? "dt-sidebar" : "dt-public-header"}>
        <Link to="/" className="dt-brand" aria-label="DevTinder home">
          <span className="dt-brand-mark"><Icon name="code" /></span>
          <span>devtinder<span className="dt-brand-dot">.</span></span>
        </Link>
        {user ? (
          <>
            <div className="dt-navigation-label">YOUR WORKSPACE</div>
            {navigation()}
            <Link to="/premium" className="dt-premium-link">
              <span className="dt-premium-icon"><Icon name="star" /></span>
              <span><strong>{user.isPremium ? `${user.membershipType || "Premium"} member` : "DevTinder Premium"}</strong><small>{user.isPremium ? "View your membership" : "Explore optional memberships"}</small></span>
              <Icon name="arrow" />
            </Link>
            <details className="dt-account">
              <summary>
                <Avatar src={user.photoUrl} name={user.firstname} decorative />
                <span><strong>{user.firstname} {user.lastname}</strong><small>Your account</small></span>
                <Icon name="user" />
              </summary>
              <div className="dt-account-menu">
                <Link to="/profile"><Icon name="user" />Edit profile</Link>
                <Link to="/premium"><Icon name="star" />Membership</Link>
                <button type="button" onClick={handleLogout}><Icon name="logout" />Log out</button>
              </div>
            </details>
          </>
        ) : (
          <Link to="/login" className="dt-button dt-button-secondary dt-button-small">Log in <Icon name="arrow" /></Link>
        )}
      </header>
      {user && (
        <>
          <div className="dt-mobile-topbar">
            <Link to="/" className="dt-brand"><span className="dt-brand-mark"><Icon name="code" /></span><span>devtinder<span className="dt-brand-dot">.</span></span></Link>
            <Link to="/premium" className="dt-icon-button" aria-label="View membership"><Icon name="star" /></Link>
            <details className="dt-mobile-account">
              <summary aria-label="Account menu"><Avatar src={user.photoUrl} name={user.firstname} decorative /></summary>
              <div className="dt-account-menu">
                <Link to="/profile"><Icon name="user" />Edit profile</Link>
                <button type="button" onClick={handleLogout}><Icon name="logout" />Log out</button>
              </div>
            </details>
          </div>
          {navigation(true)}
        </>
      )}
    </>
  );
};

export default Navbar;
