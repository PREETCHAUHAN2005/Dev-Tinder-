import Avatar from "./ui/Avatar";
import PageHeading from "./ui/PageHeading";
import StatePanel from "./ui/StatePanel";
import Icon from "./ui/Icon";
import { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchConnections = async () => {
    setLoadError("");
    try {
      const res = await axios.get(Base_Url + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch connections:", err);
      setLoadError("Your connections could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <section className="dt-page">
      <PageHeading eyebrow="YOUR DEVELOPER CIRCLE" title="Good people. Great possibilities." description="You've connected. Now start a conversation and see where it goes.">
        {Array.isArray(connections) && connections.length > 0 && <span className="dt-count-badge">{connections.length} connections</span>}
      </PageHeading>
      {loading ? <StatePanel loading title="Loading your connections" description="Getting your developer circle together." icon="people" /> : <>
        {loadError && <StatePanel error title="Couldn't load connections" description={loadError} icon="alert"><button type="button" className="dt-button dt-button-primary" onClick={() => { setLoading(true); fetchConnections(); }}>Try again<Icon name="refresh" /></button></StatePanel>}
        {!loadError && (!connections || connections.length === 0) && <StatePanel title="Your circle starts with one connection" description="Explore developer profiles and like the people you'd love to build with." icon="people"><Link className="dt-button dt-button-primary" to="/">Discover developers<Icon name="arrow" /></Link></StatePanel>}
        {connections && connections.length > 0 && <div className="dt-connections-grid">
          {connections.map((connection) => {
            const { _id, firstname, lastname, photoUrl, gender, About, skills } = connection;
            return <article key={_id} className="dt-connection-card dt-panel">
              <div className="dt-connection-top"><Avatar src={photoUrl} name={`${firstname} ${lastname}`} /><span className="dt-connected-label"><Icon name="check" />Connected</span></div>
              <h2>{firstname} {lastname}</h2>
              {gender && <p className="dt-person-meta">{gender}</p>}
              <p className="dt-connection-bio">{About || "No bio added yet. A hello is a great place to start."}</p>
              {skills && skills.length > 0 && <div className="dt-skills">{skills.slice(0, 3).map((skill, index) => <span key={index}>{skill}</span>)}{skills.length > 3 && <span className="dt-skills-more">+{skills.length - 3}</span>}</div>}
              <div className="dt-connection-actions">
                <Link to={`/chat/${_id}`} className="dt-button dt-button-primary"><Icon name="message" />Chat</Link>
                <a href={`mailto:${connection.email || ""}`} className="dt-button dt-button-secondary" aria-label={`Email ${firstname}`}><Icon name="mail" />Email</a>
              </div>
            </article>;
          })}
        </div>}
      </>}
    </section>
  );
};

export default Connections;
