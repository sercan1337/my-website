"use client";

import { useMemo } from "react";
import CodeBlock from "./CodeBlock";

interface CommentContentProps {
  content: string;
}

interface ContentPart {
  type: "text" | "code";
  content: string;
  language?: string;
}

export default function CommentContent({ content }: CommentContentProps) {
  const parts = useMemo(() => {
    const result: ContentPart[] = [];
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index).trim();
        if (textContent) {
          result.push({ type: "text", content: textContent });
        }
      }

      const language = match[1] || "text";
      const code = match[2].trim();
      if (code) {
        result.push({ type: "code", content: code, language });
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex).trim();
      if (textContent) {
        result.push({ type: "text", content: textContent });
      }
    }

    if (result.length === 0) {
      return [{ type: "text", content }];
    }

    return result;
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none">
      {parts.map((part, index) => {
        if (part.type === "code") {
          const codePart = part as ContentPart & { type: "code" };
          return (
            <CodeBlock key={index} code={codePart.content} language={codePart.language || "text"} />
          );
        }

        return (
          <p
            key={index}
            className="whitespace-pre-wrap text-gray-700 leading-relaxed dark:text-gray-300"
          >
            {part.content}
          </p>
        );
      })}
    </div>
  );
}

