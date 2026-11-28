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
      setError("Check your connection and try again.");
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
  } else if (error) {
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
      <div className="dt-discovery-stage">
        <div className={feed.length > 1 ? "dt-card-stack dt-has-next" : "dt-card-stack"}>
          <div className="dt-card-front">
            <UserCard key={top._id} user={top} onDecision={(data) => {
              if (typeof data?.message === "string" && data.message.includes("It's a Match")) setMatch(top);
            }} />
          </div>
        </div>
        <p className="dt-gesture-hint">Swipe right to connect, or left to pass.</p>
      </div>
    );
  }

  return (
    <section className="dt-page dt-discover-page">
      <PageHeading title="Discover" description="Meet developers who share your interests or bring a different skill.">
        {Array.isArray(feed) && feed.length > 0 && <span className="dt-count-badge">{feed.length} to discover</span>}
      </PageHeading>
      {content}
      {match && <MatchDialog match={match} currentUser={currentUser} onClose={() => setMatch(null)} />}
    </section>
  );
};

export default Feed;
