import React, { useEffect } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addfeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  // console.log(feed);

  const getFeed = async () => {
    try {
      const res = await axios.get(Base_Url + "/user/feed", {
        withCredentials: true,
      });
      console.log(res);
      dispatch(addfeed(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  if (!feed || feed.length <= 0) return <h1 className="flex justify-center my-10">No new users Found!</h1>;
  return (
    feed && (
      <div className="flex justify-center my-10">
        <UserCard user={feed[0]} />
      </div>
    )
  );
};

export default Feed;
