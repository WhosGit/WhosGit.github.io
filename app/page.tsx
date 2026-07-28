import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AcademicFooter } from "./components/AcademicFooter";
import { AcademicHeader } from "./components/AcademicHeader";
import { LinkedText } from "./components/LinkedText";
import { news, profile, publications, research } from "./content/site";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Personal academic website of Keyuan Hu, an M.S. student in Computer Science at the University of Illinois Urbana-Champaign.",
};

export default function Home() {
  return (
    <>
      <AcademicHeader />
      <main id="main-content" className="academic-shell home-page">
        <article className="profile-introduction">
          <div className="profile-text">
            <h1>{profile.name}</h1>
            <p className="profile-role">{profile.headline}</p>

            {profile.bio.map((paragraph) => (
              <p key={paragraph}>
                <LinkedText text={paragraph} />
              </p>
            ))}

            <p>
              Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>

            <div className="profile-links" aria-label="Profile links">
              <Link href="/research">Research</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/cv/en">English CV</Link>
              <Link href="/cv/zh">中文简历</Link>
              <a href={profile.github}>GitHub</a>
              <a href={profile.linkedin}>LinkedIn</a>
              <Link href="/blog">Blog</Link>
            </div>
          </div>

          <figure className="profile-photo">
            <Image
              src={profile.photo}
              alt="Keyuan Hu at his University of Michigan graduation"
              width={1279}
              height={1706}
              priority
              unoptimized
            />
            <figcaption>Keyuan Hu</figcaption>
          </figure>
        </article>

        <section className="home-section" aria-labelledby="news-heading">
          <h2 id="news-heading">News</h2>
          <div className="news-list">
            {news.map((item) => (
              <article className="news-item" key={`${item.date}-${item.text}`}>
                <time>{item.date}</time>
                <p>
                  <LinkedText text={item.text} />
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="research-heading">
          <h2 id="research-heading">Research</h2>
          <div className="home-research">
            <p className="section-introduction">{research.introduction}</p>

            <div className="home-research-areas">
              {research.areas.map((area) => (
                <article key={area.title}>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </article>
              ))}
            </div>

            <div className="selected-research">
              <h3>Selected experience</h3>
              {research.experience.slice(0, 2).map((item) => (
                <article key={item.title}>
                  <p className="selected-research-meta">{item.period}</p>
                  <div>
                    <h4>
                      {item.url ? (
                        <a href={item.url}>{item.title}</a>
                      ) : (
                        item.title
                      )}
                    </h4>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            {publications.length > 0 && (
              <div className="working-paper">
                <h3>Working manuscript</h3>
                <p>
                  <cite>{publications[0].title}</cite>
                  <br />
                  <span>{publications[0].status}</span>
                </p>
              </div>
            )}

            <p className="section-more">
              <Link href="/research">More research details →</Link>
            </p>
          </div>
        </section>
      </main>
      <AcademicFooter />
    </>
  );
}
