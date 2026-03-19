import React, { useEffect } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        Base_Url + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(_id));
    } catch (error) {
      console.error("Error reviewing request:", error);
    }
  };
  const fetchRequests = async () => {
    try {
      const res = await axios.get(Base_Url + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  if (!requests) return;
  if (requests.length === 0)
    return <h1 className="flex justify-center my-10">No Requests Found</h1>;
  return (
    <>
      <div className="flex justify-center my-10">
        <h1 className="text-bold text-2xl">Requests</h1>
        {requests.map((request) => {
          const { _id, firstname, lastname, photoUrl, gender, About } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className=" justify-between m-4 p-4 flex rounded-lg bg-base-300 w-2/3 mx-auto"
            >
              <div>
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full"
                  src={photoUrl}
                />
              </div>
              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">
                  {firstname + " " + lastname}
                </h2>
                <p>{About}</p>
              </div>
              <div>
                <button
                  className="btn btn-soft btn-primary mx-2"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-soft btn-secondary mx-2"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Requests;
