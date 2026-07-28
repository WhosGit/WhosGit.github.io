import Link from "next/link";
import { AcademicFooter } from "./AcademicFooter";
import { AcademicHeader } from "./AcademicHeader";

type PdfCvPageProps = {
  title: string;
  description: string;
  pdfHref: string;
};

export function PdfCvPage({
  title,
  description,
  pdfHref,
}: PdfCvPageProps) {
  return (
    <>
      <AcademicHeader />
      <main id="main-content" className="academic-shell pdf-cv-page">
        <header className="pdf-cv-header">
          <div>
            <Link className="back-link compact-back-link" href="/cv">
              ← CV languages
            </Link>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <a className="pdf-download-link" href={pdfHref}>
            Open or download PDF
          </a>
        </header>

        <object
          className="pdf-frame"
          data={pdfHref}
          type="application/pdf"
          aria-label={`${title} PDF`}
        >
          <div className="pdf-fallback">
            <p>Your browser cannot display this PDF inline.</p>
            <a href={pdfHref}>Open or download the PDF</a>
          </div>
        </object>
      </main>
      <AcademicFooter />
    </>
  );
}
