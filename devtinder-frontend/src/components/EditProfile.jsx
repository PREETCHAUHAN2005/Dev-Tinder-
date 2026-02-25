import React from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
// import { set } from "mongoose";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age);

  const [about, setAbout] = useState(user.about);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        Base_Url + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age: Number(age),
          gender,
          about,
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
                    value={firstName}
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
                    value={lastName}
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
                    value={about}
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
                    value={photoURL}
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
          user={{ firstName, lastName, photoURL, age, gender, about }}
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
