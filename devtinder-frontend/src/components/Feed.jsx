import PageHeading from "./ui/PageHeading";
import StatePanel from "./ui/StatePanel";
import MatchDialog from "./ui/MatchDialog";
import Icon from "./ui/Icon";
import { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addfeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const currentUser = useSelector((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);

  const getFeed = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(Base_Url + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addfeed(res?.data?.data || []));
    } catch (err) {
      console.error("Failed to fetch feed:", err);
      setError("Could not load developers. Check that you are logged in and the API is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!feed) {
      getFeed();
    }
  }, []);

  let content;
  if (loading || (!feed && !error)) {
    content = <StatePanel loading title="Finding your next connection" description="Loading developer profiles." icon="discover" />;
  } else if (error && !feed) {
    content = <StatePanel error title="Couldn't load developers" description={error} icon="alert">
      <button type="button" className="dt-button dt-button-primary" onClick={getFeed}><Icon name="refresh" />Try again</button>
    </StatePanel>;
  } else if (feed.length === 0) {
    content = <StatePanel title="You're all caught up" description="You've seen the available profiles. Check back later to meet more developers." icon="people">
      <button type="button" className="dt-button dt-button-primary" onClick={getFeed}><Icon name="refresh" />Refresh feed</button>
    </StatePanel>;
  } else {
    const top = feed[0];
    content = (
      <div className="dt-discovery-layout">
        <div className="dt-discovery-stage">
          <div className="dt-card-stack">
            {feed[1] && <div className="dt-card-behind" aria-hidden="true"><UserCard user={feed[1]} preview /></div>}
            <div className="dt-card-front"><UserCard key={top._id} user={top} onDecision={(data) => {
              if (typeof data?.message === "string" && data.message.includes("It's a Match")) setMatch(top);
            }} /></div>
          </div>
          <p className="dt-gesture-hint"><span>← Pass</span><span>Drag a card or use the buttons</span><span>Like →</span></p>
        </div>
        <aside className="dt-discovery-note">
          <span className="dt-note-icon"><Icon name="code" /></span>
          <p className="dt-eyebrow">GREAT THINGS START HERE</p>
          <h2>A shared stack.<br />A fresh perspective.</h2>
          <p>Meet the people behind the code. Find a new collaborator, exchange ideas, or simply say hello.</p>
          <div className="dt-note-rule" />
          <div className="dt-note-step"><Icon name="discover" /><div><strong>Discover your people</strong><p>Get to know their interests and skills.</p></div></div>
          <div className="dt-note-step"><Icon name="heart" /><div><strong>Make a connection</strong><p>Like a profile. When it's mutual, you're connected.</p></div></div>
          <div className="dt-note-step"><Icon name="message" /><div><strong>Start a conversation</strong><p>A simple hello can be the first commit.</p></div></div>
        </aside>
      </div>
    );
  }

  return (
    <section className="dt-page dt-discover-page">
      <PageHeading eyebrow="THE NEXT GREAT CONNECTION" title="Find your kind of developer." description="Different skills. Shared curiosity. See who you click with.">
        {Array.isArray(feed) && feed.length > 0 && <span className="dt-count-badge">{feed.length} to discover</span>}
      </PageHeading>
      {content}
      {match && <MatchDialog match={match} currentUser={currentUser} onClose={() => setMatch(null)} />}
    </section>
  );
};

export default Feed;
