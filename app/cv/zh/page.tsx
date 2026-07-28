import type { Metadata } from "next";
import { PdfCvPage } from "../../components/PdfCvPage";

export const metadata: Metadata = {
  title: "中文简历",
  description: "胡科远的中文简历。",
};

export default function ChineseCVPage() {
  return (
    <PdfCvPage
      title="中文简历"
      description="教育、研究、项目与教学经历。"
      pdfHref="/files/keyuan-hu-cv-zh.pdf"
    />
  );
}
