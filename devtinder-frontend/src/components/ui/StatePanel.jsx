import Icon from "./Icon";

export default function StatePanel({ title, description, icon = "discover", loading = false, error = false, children }) {
  return (
    <section className={`dt-state-panel ${error ? "dt-state-error" : ""}`} role={error ? "alert" : loading ? "status" : undefined} aria-busy={loading || undefined}>
      <div className={`dt-state-symbol ${loading ? "dt-state-loading" : ""}`}><Icon name={icon} /></div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children && <div className="dt-state-actions">{children}</div>}
    </section>
  );
}
