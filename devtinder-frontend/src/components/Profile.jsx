import StatePanel from "./ui/StatePanel";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);
  if (!user) return <div className="dt-page"><StatePanel loading title="Loading your profile" description="Getting your developer details ready." icon="user" /></div>;
  return (
    <>
      <EditProfile user={user} />
    </>
  );
};

export default Profile;
