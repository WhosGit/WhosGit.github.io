import Link from "next/link";

export function BlogHeader() {
  return (
    <header className="blog-site-header">
      <div className="blog-shell blog-header-inner">
        <div>
          <Link className="blog-title" href="/blog">
            Keyuan Hu&apos;s Notes
          </Link>
          <p>Research notes and personal observations</p>
        </div>
        <nav aria-label="Blog navigation">
          <Link href="/blog">Index</Link>
          <Link href="/">Personal website</Link>
        </nav>
      </div>
    </header>
  );
}
