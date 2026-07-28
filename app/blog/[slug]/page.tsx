import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../../content/blog";
import { BlogHeader } from "../../components/BlogHeader";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <>
      <BlogHeader />
      <main id="main-content" className="blog-shell article-page">
        <article>
          <Link className="back-link" href="/blog">
            ← Notes index
          </Link>
          <header className="article-header">
            <h1>{post.title}</h1>
            <div className="article-meta">
              <time dateTime={post.date}>{post.displayDate}</time>
              <span>{post.category}</span>
              <span>{post.readTime}</span>
            </div>
            <p className="article-lede">{post.lede}</p>
          </header>

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <div className="article-end">
            <p>Last reviewed {post.displayDate}</p>
            <Link href="/blog">Return to notes index</Link>
          </div>
        </article>
      </main>
      <footer className="blog-footer">
        <div className="blog-shell">
          <p>Keyuan Hu&apos;s Notes</p>
        </div>
      </footer>
    </>
  );
}
