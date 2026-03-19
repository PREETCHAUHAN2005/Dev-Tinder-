import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);
  if (!user) return null;
  return (
    <>
      <EditProfile user={user} />
    </>
  );
};

export default Profile;
