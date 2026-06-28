import React, { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-ring loading-lg text-[#3444DA]"></span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-12 px-6">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-Outfit">
          Connection Requests
        </h1>
        <p className="text-[#94A3B8] mt-2 text-sm">
          Other developers want to match with you. Review their proposals below.
        </p>
      </div>

      {/* Empty State */}
      {!requests || requests.length === 0 ? (
        <div className="text-center py-16 p-8 bg-[#16161a] border border-slate-800/80 rounded-2xl max-w-md mx-auto">
          <div className="text-5xl mb-4">📥</div>
          <h2 className="text-xl font-bold text-slate-300 font-Outfit">Inbox is Clean</h2>
          <p className="text-[#94A3B8] mt-2 text-xs leading-relaxed">
            No pending requests at the moment. Keep building matches by interacting on the main feed!
          </p>
        </div>
      ) : (
        /* Requests List */
        <div className="space-y-4">
          {requests.map((request) => {
            const { _id, firstname, lastname, photoUrl, gender, About } =
              request.fromUserId;

            return (
              <div
                key={request._id}
                className="p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#16161a] border border-slate-850 hover:border-slate-800 hover:shadow-micro1-glow transition-all duration-300"
              >
                {/* Profile Information */}
                <div className="flex items-center gap-4 w-full sm:w-auto text-left">
                  <div className="shrink-0">
                    <img
                      alt={`${firstname} avatar`}
                      className="w-16 h-16 rounded-full object-cover border border-slate-800"
                      src={photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg font-Outfit leading-snug">
                      {firstname} {lastname}
                    </h3>
                    {gender && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        {gender}
                      </span>
                    )}
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2 max-w-md">
                      {About || "Hi, I would love to connect and build awesome projects!"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto shrink-0 justify-end mt-2 sm:mt-0">
                  <button
                    className="flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-full text-xs font-bold text-black bg-white hover:bg-slate-200 cursor-pointer active:scale-95 transition-all text-center"
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    Accept Match
                  </button>
                  <button
                    className="flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-full text-xs font-bold bg-[#1d1d22] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white cursor-pointer active:scale-95 transition-all text-center"
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
