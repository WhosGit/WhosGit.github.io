import type { Metadata } from "next";
import { profile } from "./content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://whosgit.github.io"),
  title: {
    default: "Keyuan Hu",
    template: "%s | Keyuan Hu",
  },
  description:
    `${profile.name} is an M.S. student in Computer Science at the University of Illinois Urbana-Champaign, interested in reinforcement learning and computer systems.`,
  keywords: [
    "Keyuan Hu",
    "reinforcement learning",
    "computer systems",
    "UIUC",
    "University of Illinois Urbana-Champaign",
    "University of Michigan",
    "Shanghai Jiao Tong University",
    "human-computer interaction",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    title: profile.name,
    description:
      "M.S. student in Computer Science at the University of Illinois Urbana-Champaign.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: profile.name,
    description:
      "M.S. student in Computer Science at the University of Illinois Urbana-Champaign.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
