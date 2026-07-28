import type { Metadata } from "next";
import { PdfCvPage } from "../../components/PdfCvPage";

export const metadata: Metadata = {
  title: "English CV",
  description: "English curriculum vitae of Keyuan Hu.",
};

export default function EnglishCVPage() {
  return (
    <PdfCvPage
      title="English CV"
      description="Academic and technical résumé in English."
      pdfHref="/files/keyuan-hu-cv-en.pdf"
    />
  );
}
