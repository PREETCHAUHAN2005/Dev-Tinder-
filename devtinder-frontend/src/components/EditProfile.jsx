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
      <PageHeading eyebrow="MAKE IT YOURS" title="The person behind the code." description="Give other developers a feel for who you are and what you love building.">
        {user.isPremium && <span className="dt-plan-badge"><Icon name="star" />{user.membershipType || "Premium"} member</span>}
      </PageHeading>
      <div className="dt-profile-editor">
        <form className="dt-panel dt-form dt-editor-form" noValidate onSubmit={(event) => { event.preventDefault(); if (!saving) saveProfile(); }} aria-busy={saving}>
          <div className="dt-form-section-heading"><span>01</span><div><h2>The basics</h2><p>A face and a name to connect with.</p></div></div>
          <div className="dt-form-row">
            <label className="dt-field" htmlFor="profile-firstname">First name<input id="profile-firstname" value={firstname} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" /></label>
            <label className="dt-field" htmlFor="profile-lastname">Last name<input id="profile-lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" /></label>
          </div>
          <div className="dt-form-row">
            <label className="dt-field" htmlFor="profile-age">Age<input id="profile-age" value={age} type="number" min="18" placeholder="24" onChange={(e) => setAge(e.target.value)} /></label>
            <label className="dt-field" htmlFor="profile-gender">Gender<select id="profile-gender" value={gender} onChange={(e) => setGender(e.target.value)}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="others">Other</option></select></label>
          </div>
          <label className="dt-field" htmlFor="profile-photo">Photo URL<input id="profile-photo" value={photoUrl} type="text" placeholder="https://example.com/you.jpg" onChange={(e) => setPhotoURL(e.target.value)} aria-describedby="profile-photo-hint" /><small id="profile-photo-hint">Add a link to a photo that feels like you.</small></label>
          <div className="dt-form-section-heading dt-form-section-divider"><span>02</span><div><h2>Your developer story</h2><p>Shared interests make the best icebreakers.</p></div></div>
          <label className="dt-field" htmlFor="profile-about">About you<textarea id="profile-about" value={About} rows="4" placeholder="What are you building, learning, or curious about?" onChange={(e) => setAbout(e.target.value)} /></label>
          <label className="dt-field" htmlFor="profile-skills">Skills<input id="profile-skills" value={skillsText} placeholder="React, Node.js, Python, TypeScript" onChange={(e) => setSkillsText(e.target.value)} aria-describedby="profile-skills-hint" /><small id="profile-skills-hint">Separate each skill with a comma.</small></label>
          {err && <p className="dt-alert dt-alert-error" role="alert"><Icon name="alert" />{String(err).replace("Error: ", "")}</p>}
          {success && <p className="dt-alert dt-alert-success" role="status"><Icon name="check" />Profile saved. Looking good!</p>}
          <div className="dt-form-save"><span>Your preview updates as you type.</span><button type="submit" className="dt-button dt-button-primary" disabled={saving}>{saving ? "Saving profile..." : "Save changes"}<Icon name="check" /></button></div>
        </form>
        <aside className="dt-live-preview"><div className="dt-preview-heading"><p className="dt-eyebrow">YOUR FIRST IMPRESSION</p><span>Live preview</span></div>
          <UserCard preview user={{ firstname, lastname, photoUrl, age: age ? Number(age) : undefined, gender, About, skills: skillsText.split(",").map((s) => s.trim()).filter((s) => s.length > 0) }} />
          <p className="dt-preview-caption">This is how you'll appear in Discover.</p>
        </aside>
      </div>
    </section>
  );
};

export default EditProfile;
