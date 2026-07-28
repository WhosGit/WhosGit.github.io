import Link from "next/link";
import type { ReactNode } from "react";

const markdownLink = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

export function LinkedText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(markdownLink)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push(text.slice(cursor, index));
    }

    parts.push(
      <Link href={match[2]} key={`${match[2]}-${index}`}>
        {match[1]}
      </Link>,
    );
    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
}
