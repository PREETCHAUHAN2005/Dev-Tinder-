import Avatar from "./ui/Avatar";
import PageHeading from "./ui/PageHeading";
import StatePanel from "./ui/StatePanel";
import Icon from "./ui/Icon";
import Skills from "./ui/Skills";
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
      <PageHeading title="Connections" description="Pick up a conversation with someone you’ve connected with.">
        {Array.isArray(connections) && connections.length > 0 && <span className="dt-count-badge">{connections.length} {connections.length === 1 ? "connection" : "connections"}</span>}
      </PageHeading>
      {loading ? <StatePanel loading title="Loading your connections" icon="people" /> : <>
        {loadError && <StatePanel error title="Couldn't load connections" description={loadError} icon="alert"><button type="button" className="dt-button dt-button-primary" onClick={() => { setLoading(true); fetchConnections(); }}>Try again<Icon name="refresh" /></button></StatePanel>}
        {!loadError && (!connections || connections.length === 0) && <StatePanel title="No connections yet" description="When a connection request is accepted, you can message each other here." icon="people"><Link className="dt-button dt-button-primary" to="/">Discover developers<Icon name="arrow" /></Link></StatePanel>}
        {connections && connections.length > 0 && <div className="dt-connections-grid">
          {connections.map((connection) => {
            const { _id, firstname, lastname, photoUrl, gender, About, skills } = connection;
            return <article key={_id} className="dt-connection-card dt-panel">
              <div className="dt-connection-top"><Avatar src={photoUrl} name={`${firstname} ${lastname}`} /></div>
              <h2>{firstname} {lastname}</h2>
              {gender && <p className="dt-person-meta">{gender}</p>}
              {About && <p className="dt-connection-bio">{About}</p>}
              <Skills skills={skills} limit={3} />
              <div className="dt-connection-actions">
                <Link to={`/chat/${_id}`} className="dt-button dt-button-primary"><Icon name="message" />Chat</Link>
                {connection.email && <a href={`mailto:${connection.email}`} className="dt-button dt-button-secondary" aria-label={`Email ${firstname}`}><Icon name="mail" />Email</a>}
              </div>
            </article>;
          })}
        </div>}
      </>}
    </section>
  );
};

export default Connections;
