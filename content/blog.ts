import generatedPosts from "./blog.generated.json";

export type Post = {
  slug: string;
  title: string;
  summary: string;
  lede: string;
  category: string;
  tags: string[];
  date: string;
  displayDate: string;
  readTime: string;
  visualLabel: string;
  html: string;
};

export const posts = generatedPosts as Post[];
