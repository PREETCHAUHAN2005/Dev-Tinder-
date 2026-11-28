import PageHeading from "./ui/PageHeading";
import Icon from "./ui/Icon";
import { useState } from "react";
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
    <section className="dt-page">
      <PageHeading title="Your profile" description="Show other developers who you are and what you’re working on.">
        {user.isPremium && <span className="dt-plan-badge"><Icon name="star" />{user.membershipType || "Premium"} member</span>}
      </PageHeading>
      <div className="dt-profile-editor">
        <form className="dt-panel dt-form dt-editor-form" noValidate onSubmit={(event) => { event.preventDefault(); if (!saving) saveProfile(); }} aria-busy={saving}>
          <div className="dt-form-section-heading"><h2>Profile details</h2></div>
          <div className="dt-form-row">
            <div className="dt-field"><label htmlFor="profile-firstname">First name</label><input id="profile-firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" /></div>
            <div className="dt-field"><label htmlFor="profile-lastname">Last name</label><input id="profile-lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" /></div>
          </div>
          <div className="dt-form-row">
            <div className="dt-field"><label htmlFor="profile-age">Age</label><input id="profile-age" value={age} type="number" min="18" placeholder="24" onChange={(e) => setAge(e.target.value)} /></div>
            <div className="dt-field"><label htmlFor="profile-gender">Gender</label><select id="profile-gender" value={gender} onChange={(e) => setGender(e.target.value)}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="others">Other</option></select></div>
          </div>
          <div className="dt-field"><label htmlFor="profile-photo">Photo URL</label><input id="profile-photo" value={photoUrl} type="text" placeholder="https://example.com/you.jpg" onChange={(e) => setPhotoURL(e.target.value)} aria-describedby="profile-photo-hint" /><small id="profile-photo-hint">Add a link to a photo that feels like you.</small></div>
          <div className="dt-form-section-heading dt-form-section-divider"><h2>About your work</h2></div>
          <div className="dt-field"><label htmlFor="profile-about">About you</label><textarea id="profile-about" value={About} rows="4" placeholder="What are you building, learning, or curious about?" onChange={(e) => setAbout(e.target.value)} /></div>
          <div className="dt-field"><label htmlFor="profile-skills">Skills</label><input id="profile-skills" value={skillsText} placeholder="React, Node.js, Python, TypeScript" onChange={(e) => setSkillsText(e.target.value)} aria-describedby="profile-skills-hint" /><small id="profile-skills-hint">Separate each skill with a comma.</small></div>
          {err && <p className="dt-alert dt-alert-error" role="alert"><Icon name="alert" />{String(err).replace("Error: ", "")}</p>}
          {success && <p className="dt-alert dt-alert-success" role="status"><Icon name="check" />Profile saved.</p>}
          <div className="dt-form-save"><button type="submit" className="dt-button dt-button-primary" disabled={saving}>{saving ? "Saving profile..." : "Save changes"}<Icon name="check" /></button></div>
        </form>
        <aside className="dt-live-preview"><div className="dt-preview-heading"><h2>Live preview</h2></div>
          <UserCard preview user={{ firstname, lastname, photoUrl, age: age ? Number(age) : undefined, gender, About, skills: skillsText.split(",").map((s) => s.trim()).filter((s) => s.length > 0) }} />
          <p className="dt-preview-caption">Your card updates as you type.</p>
        </aside>
      </div>
    </section>
  );
};

export default EditProfile;
