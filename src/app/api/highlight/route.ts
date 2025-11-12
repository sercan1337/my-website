import { NextRequest, NextResponse } from "next/server";
import { codeToHtml } from "shiki";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language = "text", theme = "github-dark" } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    const html = await codeToHtml(code, {
      lang: language,
      theme: theme,
    });

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Error highlighting code:", error);
    return NextResponse.json(
      { error: "Failed to highlight code" },
      { status: 500 }
    );
  }
}

