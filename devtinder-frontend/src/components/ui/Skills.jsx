export default function Skills({ skills, limit = 4 }) {
  if (!skills?.length) return null;
  const chip = (skill, index) => <li key={index}>{skill}</li>;
  return (
    <div className="dt-skill-group">
      <ul className="dt-skills" aria-label="Profile skills">{skills.slice(0, limit).map(chip)}</ul>
      {skills.length > limit && (
        <details className="dt-more-skills">
          <summary>{skills.length - limit} more {skills.length - limit === 1 ? "skill" : "skills"}</summary>
          <ul className="dt-skills" aria-label="Additional skills">{skills.slice(limit).map(chip)}</ul>
        </details>
      )}
    </div>
  );
}
