import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Sercan Duran",
  description: "9th-grade student with a passion for building software. Combining modern web technologies with clean design.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
