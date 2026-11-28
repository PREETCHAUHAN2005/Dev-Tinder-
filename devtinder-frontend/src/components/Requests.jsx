import { Link } from "react-router-dom";
import Avatar from "./ui/Avatar";
import PageHeading from "./ui/PageHeading";
import StatePanel from "./ui/StatePanel";
import Icon from "./ui/Icon";
import { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewing, setReviewing] = useState("");
  const [reviewNotice, setReviewNotice] = useState("");

  const reviewRequest = async (status, _id) => {
    setReviewing(status + ":" + _id);
    setReviewError("");
    setReviewNotice("");
    try {
      await axios.post(
        Base_Url + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
      setReviewNotice(status === "accepted" ? "Connection accepted. You can now chat from Connections." : "Request declined.");
    } catch (error) {
      console.error("Error reviewing request:", error);
      setReviewError("Your response was not saved. Please try again.");
    } finally {
      setReviewing("");
    }
  };

  const fetchRequests = async () => {
    setLoadError("");
    try {
      const res = await axios.get(Base_Url + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
      setLoadError("Your requests could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <section className="dt-page dt-page-narrow">
      <PageHeading title="Connection requests" description="Choose which developers you’d like to connect with.">
        {Array.isArray(requests) && requests.length > 0 && <span className="dt-count-badge">{requests.length} pending</span>}
      </PageHeading>
      {reviewNotice && <p className="dt-alert dt-alert-success" role="status"><Icon name="check" />{reviewNotice}</p>}
      {reviewError && <p className="dt-alert dt-alert-error" role="alert"><Icon name="alert" />{reviewError}</p>}
      {loading ? <StatePanel loading title="Loading your requests" icon="inbox" /> : <>
        {loadError && <StatePanel error title="Couldn't load requests" description={loadError} icon="alert"><button type="button" className="dt-button dt-button-primary" onClick={() => { setLoading(true); fetchRequests(); }}>Try again<Icon name="refresh" /></button></StatePanel>}
        {!loadError && (!requests || requests.length === 0) && <StatePanel title="You're up to date" description="New connection requests will appear here." icon="inbox"><Link to="/" className="dt-button dt-button-primary">Explore Discover<Icon name="arrow" /></Link></StatePanel>}
        {requests && requests.length > 0 && <div className="dt-request-list">{requests.map((request) => {
          const { firstname, lastname, photoUrl, gender, About } = request.fromUserId;
          return <article className="dt-request-card dt-panel" key={request._id}>
            <Avatar src={photoUrl} name={`${firstname} ${lastname}`} />
            <div className="dt-request-person"><h2>{firstname} {lastname}</h2>{gender && <p className="dt-person-meta">{gender}</p>}{About && <p className="dt-request-bio">{About}</p>}</div>
            <div className="dt-request-actions">
              <button type="button" className="dt-button dt-button-primary" disabled={Boolean(reviewing)} onClick={() => reviewRequest("accepted", request._id)}><Icon name="check" />{reviewing === "accepted:" + request._id ? "Accepting..." : "Accept"}</button>
              <button type="button" className="dt-button dt-button-secondary" disabled={Boolean(reviewing)} onClick={() => reviewRequest("rejected", request._id)}><Icon name="close" />{reviewing === "rejected:" + request._id ? "Declining..." : "Decline"}</button>
            </div>
          </article>;
        })}</div>}
      </>}
    </section>
  );
};

export default Requests;
