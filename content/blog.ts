// Duplicate one post object below when publishing a new blog entry.
export type PostSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Post = {
  slug: string;
  title: string;
  summary: string;
  lede: string;
  category: "Research" | "Engineering" | "Reflection";
  tags: string[];
  date: string;
  displayDate: string;
  readTime: string;
  visualLabel: string;
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "building-smartmentor-as-a-real-rag-system",
    title: "Building SmartMentor as a real RAG system",
    summary:
      "Notes on turning semantic matching from a demo into a useful student–mentor discovery workflow.",
    lede:
      "A good retrieval system is not just an embedding model and a vector database. It is a product decision about what users mean, what evidence the system can use, and how uncertainty should appear in the interface.",
    category: "Engineering",
    tags: ["RAG", "LLM systems", "Product"],
    date: "2026-07-24",
    displayDate: "Jul 24, 2026",
    readTime: "6 min",
    visualLabel: "query → evidence → match",
    sections: [
      {
        heading: "The problem behind the feature",
        paragraphs: [
          "Students often describe interests in loose language while mentor profiles use specialized vocabulary. Keyword search misses useful connections, but a purely generative answer can invent them.",
          "SmartMentor treats matching as an evidence problem: retrieve relevant profile fragments, rank a constrained set of mentors, and keep the source text visible.",
        ],
      },
      {
        heading: "A two-stage path",
        paragraphs: [
          "The first version uses a direct long-context comparison to establish a product baseline. The next version creates embeddings for cleaned mentor descriptions and retrieves a smaller candidate set before asking a language model to explain the match.",
        ],
        bullets: [
          "Normalize profiles without deleting domain-specific language.",
          "Retrieve candidates with stable identifiers and metadata.",
          "Constrain generation to the retrieved candidate set.",
          "Evaluate both ranking quality and explanation faithfulness.",
        ],
      },
      {
        heading: "What I am watching next",
        paragraphs: [
          "The interesting work is evaluation. I want to compare system rankings with choices made by real students and understand when a concise explanation changes trust—for better or worse.",
        ],
      },
    ],
  },
  {
    slug: "what-paxos-teaches-about-clear-thinking",
    title: "What Paxos teaches about clear thinking",
    summary:
      "A systems reading note on invariants, failure models, and why the shortest explanation is rarely the first one.",
    lede:
      "Distributed algorithms are difficult because ordinary intuition quietly assumes a shared present. Paxos becomes easier when I stop following messages and start following the invariant.",
    category: "Research",
    tags: ["Distributed systems", "Paxos", "Reading note"],
    date: "2026-07-12",
    displayDate: "Jul 12, 2026",
    readTime: "5 min",
    visualLabel: "prepare / accept / learn",
    sections: [
      {
        heading: "Start with the safety claim",
        paragraphs: [
          "Before tracing the protocol, write down what must never happen: two different values must not both be chosen. The quorum intersection argument is the bridge between that statement and the mechanics.",
          "This changes the reading experience. Proposal numbers, promises, and accepted values are no longer isolated rules; they are instruments protecting one global claim.",
        ],
      },
      {
        heading: "Failure is part of the model",
        paragraphs: [
          "A correct implementation should be explained in the language of delayed, duplicated, reordered, and lost messages. Happy-path diagrams are useful only after the failure model is explicit.",
        ],
        bullets: [
          "Safety should survive arbitrary delay and retry.",
          "Liveness needs additional timing or leadership assumptions.",
          "Tests should target invariants, not just expected sequences.",
        ],
      },
      {
        heading: "A transferable habit",
        paragraphs: [
          "The larger lesson is to search for the protected invariant before studying the machinery. I now use the same habit when reading data systems and machine-learning pipelines.",
        ],
      },
    ],
  },
  {
    slug: "why-this-site-is-a-working-notebook",
    title: "Why this site is a working notebook",
    summary:
      "A small statement of intent for publishing unfinished ideas without turning the process into performance.",
    lede:
      "I want a place where research identity is not a frozen résumé. This site is designed to hold finished work and the smaller observations that lead to it.",
    category: "Reflection",
    tags: ["Learning", "Writing", "Research practice"],
    date: "2026-07-01",
    displayDate: "Jul 1, 2026",
    readTime: "3 min",
    visualLabel: "observe · connect · revisit",
    sections: [
      {
        heading: "The role of small notes",
        paragraphs: [
          "A paper summary, a failed experiment, or a question from office hours may not deserve a formal article. It can still become useful when it is dated, linked, and revisited.",
          "Writing also exposes the exact place where my understanding becomes vague. That makes a note part of the learning process rather than a report written after learning is complete.",
        ],
      },
      {
        heading: "What belongs here",
        paragraphs: [
          "This notebook will collect paper notes, implementation journals, research updates, and occasional reflections on how I work.",
        ],
        bullets: [
          "What a paper changes in my mental model.",
          "How a technical system behaves outside its clean diagram.",
          "Which questions remain after a project ships.",
        ],
      },
      {
        heading: "A promise to future me",
        paragraphs: [
          "Prefer honest, useful fragments over polished silence. Add context, distinguish evidence from interpretation, and update a note when the underlying view changes.",
        ],
      },
    ],
  },
];
