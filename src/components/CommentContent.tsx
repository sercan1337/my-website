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
    // Match code blocks with optional language: ```language or ```
    // Handle both with and without newline after opening ```
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index).trim();
        if (textContent) {
          result.push({ type: "text", content: textContent });
        }
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      if (code) {
        result.push({ type: "code", content: code, language });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex).trim();
      if (textContent) {
        result.push({ type: "text", content: textContent });
      }
    }

    // If no code blocks found, return entire content as text
    if (result.length === 0) {
      return [{ type: "text", content }];
    }

    return result;
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return (
            <CodeBlock key={index} code={part.content} language={part.language || "text"} />
          );
        }

        // Render text with line breaks preserved
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

