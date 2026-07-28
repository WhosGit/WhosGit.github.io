import Link from "next/link";

const links = [
  { href: "/research", label: "Research" },
  { href: "/projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/blog", label: "Blog" },
];

export function AcademicHeader() {
  return (
    <header className="academic-header">
      <div className="academic-shell header-inner">
        <Link className="academic-name" href="/">
          Keyuan Hu
        </Link>
        <nav aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
