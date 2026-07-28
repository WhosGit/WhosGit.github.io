import type { Metadata } from "next";
import { AcademicFooter } from "../components/AcademicFooter";
import { AcademicHeader } from "../components/AcademicHeader";
import { projects } from "../content/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected software and academic projects by Keyuan Hu.",
};

export default function ProjectsPage() {
  return (
    <>
      <AcademicHeader />
      <main id="main-content" className="academic-shell document-page">
        <header className="document-header">
          <h1>Projects</h1>
          <p>
            A selection of software and academic projects. Repository links are
            provided where the work is publicly available.
          </p>
        </header>

        <section className="document-section project-records">
          {projects.map((project) => (
            <article className="project-record" key={project.title}>
              <div className="record-meta">{project.date}</div>
              <div>
                <h2>
                  {project.link ? (
                    <a href={project.link}>{project.title}</a>
                  ) : (
                    project.title
                  )}
                </h2>
                <p>{project.description}</p>
                <p className="project-methods">{project.methods}</p>
              </div>
              {project.link && (
                <a className="record-link" href={project.link}>
                  Repository
                </a>
              )}
            </article>
          ))}
        </section>
      </main>
      <AcademicFooter />
    </>
  );
}
