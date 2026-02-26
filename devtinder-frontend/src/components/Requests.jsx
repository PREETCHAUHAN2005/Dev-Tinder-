import React, { useEffect } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const fetchRequests = async () => {
    try {
      const res = await axios.get(Base_Url + "/user/requests/recieved", {
        withCredentialst: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {}
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  if (!requests) return;
  if (requests.length === 0) return <h1>No Requests Found</h1>;
  return (
    <>
      <div className="flex justify-center my-10">
        <h1 className="text-bold text-2xl">Connections</h1>
        {requests.map((connection) => {
          const { _id, firstName, lastName, photoUrl, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="m-4 p-4 flex rounded-lg bg-base-300 w-1/2 mx-auto"
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
                  {firstName + " " + lastName}
                </h2>
                <p>{about}</p>
              </div>
              <div>
                <button className="btn btn-soft btn-primary">Primary</button>
                <button className="btn btn-soft btn-secondary">
                  Secondary
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
