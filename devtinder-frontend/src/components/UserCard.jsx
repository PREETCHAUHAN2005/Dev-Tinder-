import React from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoURL, age, gender, about } = user;
  const dispatch = useDispatch();
  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        Base_Url + "/request/send/" + status + "/" + userId,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeUserFromFeed(status, _id));
    } catch (error) {}
  };
  return (
    <div>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src={user.photoURL} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p> {gender + ", " + age}</p>}
          {about && <p>{about}</p>}

          <div className="card-actions justify-center flex space-x-6">
            <button
              className="btn btn-primary"
              onClick={() => handleSendRequest("Ignore", _id)}
            >
              Ignore
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => handleSendRequest("Interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
