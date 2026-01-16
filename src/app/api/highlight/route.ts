import { NextResponse } from "next/server";
import { createHighlighter  } from "shiki";

export async function POST(req: Request) {
  try {
    const { code, language, theme } = await req.json();

    const highlighter = await createHighlighter ({
      themes: ["github-dark", "github-light"],
      langs: [language || "text"],
    });

    const html = highlighter.codeToHtml(code, {
      lang: language || "text",
      theme: theme === "github-light" ? "github-light" : "github-dark",
    });

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Shiki highlight error:", error);
    return NextResponse.json(
      { error: "Failed to highlight code" },
      { status: 500 }
    );
  }
}

