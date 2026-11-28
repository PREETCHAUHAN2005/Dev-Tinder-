export default function PageHeading({ eyebrow, title, description, children }) {
  return (
    <header className="dt-page-heading">
      <div>
        {eyebrow && <p className="dt-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="dt-page-description">{description}</p>}
      </div>
      {children && <div className="dt-heading-actions">{children}</div>}
    </header>
  );
}
