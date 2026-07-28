import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "../../content/blog";
import { BlogHeader } from "../components/BlogHeader";

export const metadata: Metadata = {
  title: "Notes",
  description: "Research notes and personal observations by Keyuan Hu.",
};

export default function BlogPage() {
  const years = Array.from(
    new Set(posts.map((post) => new Date(post.date).getFullYear())),
  );

  return (
    <>
      <BlogHeader />
      <main id="main-content" className="blog-shell blog-index-page">
        <header className="blog-introduction">
          <h1>Notes</h1>
          <p>
            This is a personal space for paper notes, technical records, and
            short observations. Entries may be revised as my understanding
            changes.
          </p>
        </header>

        {years.map((year) => (
          <section className="blog-year" key={year}>
            <h2>{year}</h2>
            <div>
              {posts
                .filter((post) => new Date(post.date).getFullYear() === year)
                .map((post) => (
                  <article className="blog-index-entry" key={post.slug}>
                    <time dateTime={post.date}>{post.displayDate}</time>
                    <div>
                      <h3>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p>{post.summary}</p>
                      <p className="entry-tags">
                        {post.category} · {post.tags.join(" · ")}
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </main>
      <footer className="blog-footer">
        <div className="blog-shell">
          <p>Keyuan Hu&apos;s Notes</p>
          <p>Last updated {posts[0]?.displayDate ?? "recently"}</p>
        </div>
      </footer>
    </>
  );
}
