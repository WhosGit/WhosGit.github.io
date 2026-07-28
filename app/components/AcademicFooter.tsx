import { profile } from "../content/site";

export function AcademicFooter() {
  return (
    <footer className="academic-footer">
      <div className="academic-shell footer-inner">
        <p>{profile.name}</p>
        <p>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={profile.github}>GitHub</a>
        </p>
        <p>Last updated July 2026</p>
      </div>
    </footer>
  );
}
