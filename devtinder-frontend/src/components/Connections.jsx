import React, { useEffect } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { connections } from "mongoose";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(Base_Url + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
      //   console.log(res.data);
    } catch (err) {
      // Handle Error Case
      err.status(500).json({ message: "Failed to fetch connections" });
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connections) return;
  if (connections.length === 0) return <h1>No Connections Found</h1>;

  return (
    <>
      <div className="flex justify-center my-10">
        <h1 className="text-bold text-2xl">Connections</h1>
        {connections.map((connection) => {
          const { firstName, lastName, photoUrl, gender, about } = connection;

          return (
            <div className="m-4 p-4 flex rounded-lg bg-base-300 w-1/2 mx-auto">
              <div>
                <img alt="photo" className="w-20 h-20 rounded-full" src={photoUrl} />
              </div>
              <div className="text-left mx-4">
                <h2 className="font-bold text-xl">{firstName + " " + lastName}</h2>
                <p>{about}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Connections;
