import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstname, setFirstName] = useState(user.firstname || "");
  const [lastname, setLastName] = useState(user.lastname || "");
  const [gender, setGender] = useState(user.gender || "");
  const [age, setAge] = useState(user.age || "");
  const [About, setAbout] = useState(user.About || "");
  const [photoUrl, setPhotoURL] = useState(user.photoUrl || "");
  const [skillsText, setSkillsText] = useState((user.skills || []).join(", "));
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setErr("");
    setSuccess(false);
    setSaving(true);
    
    // Parse skills
    const parsedSkills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const res = await axios.patch(
        Base_Url + "/profile/edit",
        {
          firstname,
          lastname,
          photoUrl,
          age: age ? Number(age) : undefined,
          gender,
          About,
          skills: parsedSkills,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "An error occurred while updating profile.";
      setErr(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-6">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-Outfit">
          Edit Profile
        </h1>
        <p className="text-[#94A3B8] mt-2 text-sm">
          Customize how other developers see your card in the matchmaking feed.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 justify-center items-start">
        
        {/* Editor Form */}
        <div className="w-full lg:max-w-xl bg-[#16161a] p-6 sm:p-8 rounded-2xl border border-slate-850 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 font-Outfit border-b border-slate-800/60 pb-3">
            Profile Details
          </h2>

          <div className="space-y-4">
            
            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">First Name</label>
                <input
                  value={firstname}
                  type="text"
                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Last Name</label>
                <input
                  value={lastname}
                  type="text"
                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Age</label>
                <input
                  value={age}
                  type="number"
                  min="18"
                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm"
                  placeholder="24"
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Gender</label>
                <select
                  value={gender}
                  className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Other</option>
                </select>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Photo URL</label>
              <input
                value={photoUrl}
                type="text"
                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm"
                placeholder="https://example.com/photo.jpg"
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>

            {/* About Bio */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">About / Bio</label>
              <textarea
                value={About}
                rows="3"
                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm resize-none"
                placeholder="Talk about your coding journey and interests..."
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Skills (comma-separated)</label>
              <input
                value={skillsText}
                type="text"
                className="w-full bg-[#121214] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#3444DA] focus:ring-1 focus:ring-[#3444DA] transition-all duration-300 text-sm"
                placeholder="react, node.js, python, typescript"
                onChange={(e) => setSkillsText(e.target.value)}
              />
            </div>

          </div>

          {err && (
            <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>{err.replace("Error: ", "")}</span>
            </div>
          )}

          <div className="mt-8">
            <button
              className="w-full py-3 rounded-full font-bold text-white bg-[#3444DA] hover:bg-[#2B39B8] shadow-lg hover:shadow-micro1-active active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Saving Profile...</span>
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="w-full max-w-sm sticky top-24 shrink-0">
          <div className="text-left mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Live Card Preview</span>
          </div>
          <UserCard
            user={{
              firstname,
              lastname,
              photoUrl,
              age: age ? Number(age) : undefined,
              gender,
              About,
              skills: skillsText
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0),
            }}
          />
        </div>

      </div>

      {success && (
        <div className="toast toast-bottom toast-end z-50">
          <div className="alert alert-success bg-emerald-500 border-none text-white font-semibold rounded-2xl shadow-xl flex gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
