import type { Metadata } from "next";
import { AcademicFooter } from "../components/AcademicFooter";
import { AcademicHeader } from "../components/AcademicHeader";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description: "English and Chinese curriculum vitae of Keyuan Hu.",
};

const cvPages = [
  {
    href: "/files/keyuan-hu-cv-en.pdf",
    language: "English",
    title: "English CV",
    description: "One-page academic and technical résumé in English.",
  },
  {
    href: "/files/keyuan-hu-cv-zh.pdf",
    language: "中文",
    title: "中文简历",
    description: "中文一页简历，包含教育、研究、项目与教学经历。",
  },
];

export default function CVPage() {
  return (
    <>
      <AcademicHeader />
      <main id="main-content" className="academic-shell document-page cv-index">
        <header className="document-header">
          <h1>Curriculum Vitae</h1>
          <p>
            Choose a language to open the corresponding PDF directly in your
            browser.
          </p>
        </header>

        <div className="cv-choice-list">
          {cvPages.map((cv) => (
            <article key={cv.href}>
              <p className="cv-choice-language">{cv.language}</p>
              <h2>
                <a href={cv.href}>{cv.title}</a>
              </h2>
              <p>{cv.description}</p>
              <a className="cv-choice-link" href={cv.href}>
                Open PDF →
              </a>
            </article>
          ))}
        </div>
      </main>
      <AcademicFooter />
    </>
  );
}
