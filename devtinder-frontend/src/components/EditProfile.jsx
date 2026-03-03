import React from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
// import { set } from "mongoose";

const EditProfile = ({ user }) => {
  const [firstname, setFirstName] = useState(user.firstname || "");
  const [lastname, setLastName] = useState(user.lastname || "");

  const [gender, setGender] = useState(user.gender || "");
  const [age, setAge] = useState(user.age || "");

  const [About, setAbout] = useState(user.About || "");
  const [photoUrl, setPhotoURL] = useState(user.photoUrl || "");
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        Base_Url + "/profile/edit",
        {
          firstname,
          lastname,
          photoUrl,
          age: Number(age),
          gender,
          About,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "An error occurred";
      console.log("Backend Error:", errorMessage);
      setErr(errorMessage);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card card-border bg-base-300 w-96">
            <div className="card-body my-4">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div className=" space-evenly">
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">First name</legend>
                  <input
                    value={firstname}
                    type="text"
                    className="input"
                    placeholder="Enter your First name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className=" space-evenly">
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">Last name</legend>
                  <input
                    value={lastname}
                    type="text"
                    className="input"
                    placeholder="Enter your Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className="space-evenly">
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">Gender</legend>
                  <input
                    value={gender}
                    type="text"
                    className="input"
                    placeholder="Enter your Gender"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className=" space-evenly">
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">About</legend>
                  <input
                    value={About}
                    type="text"
                    className="input"
                    placeholder="Your Description"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className=" space-evenly">
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">Age</legend>
                  <input
                    value={age}
                    type="text"
                    className="input"
                    placeholder="Enter your Age"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </fieldset>
              </div>
              <div className=" my-1 space-evenly">
                <fieldset className="fieldset ">
                  <legend className="fieldset-legend">Photo Url</legend>
                  <input
                    value={photoUrl}
                    type="text"
                    className="input"
                    placeholder="Enter your Photo URL"
                    onChange={(e) => setPhotoURL(e.target.value)}
                  />
                </fieldset>
              </div>

              <div className="card-actions justify-center">
                <button className="btn btn-primary " onClick={saveProfile}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstname, lastname, photoUrl, age, gender, About }}
        />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile Updated</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
