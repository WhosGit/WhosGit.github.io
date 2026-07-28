import type { Metadata } from "next";
import { AcademicFooter } from "../components/AcademicFooter";
import { AcademicHeader } from "../components/AcademicHeader";
import { publications, research } from "../content/site";

export const metadata: Metadata = {
  title: "Research",
  description: "Research interests and experience of Keyuan Hu.",
};

export default function ResearchPage() {
  return (
    <>
      <AcademicHeader />
      <main id="main-content" className="academic-shell document-page">
        <header className="document-header">
          <h1>Research</h1>
          <p>{research.introduction}</p>
        </header>

        <section className="document-section">
          <h2>Research interests</h2>
          <div className="interest-list">
            {research.areas.map((area) => (
              <div key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="document-section">
          <h2>Research experience</h2>
          <div className="record-list">
            {research.experience.map((item) => (
              <article className="record" key={item.title}>
                <div className="record-meta">{item.period}</div>
                <div>
                  <h3>
                    {item.url ? (
                      <a href={item.url}>{item.title}</a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <p className="record-subtitle">
                    {item.affiliation}
                    {item.advisor ? ` · ${item.advisor}` : ""}
                  </p>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="document-section">
          <h2>Publications &amp; manuscripts</h2>
          <div className="publication-list">
            {publications.map((publication) => (
              <article className="publication" key={publication.title}>
                <div className="record-meta">{publication.year}</div>
                <div>
                  <h3>
                    {publication.paperUrl ? (
                      <a href={publication.paperUrl}>{publication.title}</a>
                    ) : (
                      publication.title
                    )}
                  </h3>
                  <p>{publication.authors}</p>
                  <p className="record-subtitle">{publication.status}</p>
                  {(publication.paperUrl || publication.codeUrl) && (
                    <p className="publication-links">
                      {publication.paperUrl && (
                        <a href={publication.paperUrl}>Paper</a>
                      )}
                      {publication.codeUrl && (
                        <a href={publication.codeUrl}>Code</a>
                      )}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <AcademicFooter />
    </>
  );
}
