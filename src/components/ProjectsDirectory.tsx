"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

type DirectoryNode = {
  name: string;
  type: "folder" | "file";
  status?: string;
  modified?: string;
  size?: string;
  description?: string;
  href?: string;
  children?: DirectoryNode[];
};

const projectTree: DirectoryNode[] = [
  {
    name: "novus/",
    type: "folder",
    status: "active",
    modified: "2026-01-26",
    size: "dir",
    description:
      "Education-focused project designed to make learning more structured and engaging.",
    href: "https://github.com/sercan1337/novus",
    children: [
      {
        name: "README.md",
        type: "file",
        modified: "2026-01-26",
        size: "4 KB",
        description: "Project overview, scope notes, and current direction.",
      },
      {
        name: "screenshots/",
        type: "folder",
        modified: "2026-01-18",
        size: "dir",
        description: "Interface captures from the active build.",
        children: [
          { name: "dashboard.png", type: "file", modified: "2026-01-18", size: "88 KB" },
          { name: "lesson-flow.png", type: "file", modified: "2026-01-18", size: "92 KB" },
        ],
      },
      {
        name: "tech-stack.json",
        type: "file",
        modified: "2026-01-20",
        size: "2 KB",
        description: "Next.js, TypeScript, Tailwind, and learning-system notes.",
      },
      {
        name: "changelog.txt",
        type: "file",
        modified: "2026-01-26",
        size: "3 KB",
        description: "Small releases, fixes, and shipped experiments.",
      },
    ],
  },
  {
    name: "archive/",
    type: "folder",
    status: "archived",
    modified: "2025-11-12",
    size: "dir",
    description: "Design experiments, rebuilds, and UI fragments from previous iterations.",
    children: [
      {
        name: "old-site-redesign.log",
        type: "file",
        modified: "2025-11-12",
        size: "8 KB",
        description: "A record of layout tests and visual decisions from older versions.",
      },
      {
        name: "experiments.txt",
        type: "file",
        modified: "2025-10-03",
        size: "5 KB",
        description: "Loose UI ideas worth keeping around, even if they never shipped.",
      },
    ],
  },
  {
    name: "lab/",
    type: "folder",
    status: "draft",
    modified: "2026-01-08",
    size: "dir",
    description: "A placeholder for the next system I have not named yet.",
    children: [
      {
        name: "next-idea.tmp",
        type: "file",
        modified: "2026-01-08",
        size: "1 KB",
        description: "Temporary notes before the idea becomes real enough to name.",
      },
      {
        name: "concepts/",
        type: "folder",
        modified: "2026-01-08",
        size: "dir",
        description: "Sketches, rough specs, and unfinished concepts.",
        children: [
          { name: "personal-os.note", type: "file" },
          { name: "learning-tools.todo", type: "file" },
        ],
      },
    ],
  },
];

function getFolderPaths(nodes: DirectoryNode[], parentPath = ""): string[] {
  return nodes.flatMap((node) => {
    const path = `${parentPath}${node.name}`;
    const nested = node.children ? getFolderPaths(node.children, path) : [];
    return node.type === "folder" ? [path, ...nested] : nested;
  });
}

function DirectoryBranch({
  nodes,
  level = 0,
  parentPath = "",
  openFolders,
  toggleFolder,
}: {
  nodes: DirectoryNode[];
  level?: number;
  parentPath?: string;
  openFolders: Set<string>;
  toggleFolder: (path: string) => void;
}) {
  return (
    <ul className={cn("os-tree", level > 0 && "os-tree-nested")}>
      {nodes.map((node, index) => {
        const path = `${parentPath}${node.name}`;
        const isFolder = node.type === "folder";
        const isOpen = isFolder && openFolders.has(path);
        const isLast = index === nodes.length - 1;
        const marker = isLast ? "`--" : "|--";
        const row = (
          <>
            <span className="os-tree-marker" aria-hidden="true">
              {marker}
            </span>
            {isFolder ? (
              <>
                <ChevronRight
                  className={cn("os-tree-chevron", isOpen && "is-open")}
                  aria-hidden="true"
                />
                <Folder className="h-4 w-4 shrink-0 text-[#9c7cff]" aria-hidden="true" />
              </>
            ) : (
              <>
                <span className="os-tree-spacer" aria-hidden="true" />
                <FileText className="h-4 w-4 shrink-0 text-[#d8d8ea]" aria-hidden="true" />
              </>
            )}
            <span className="min-w-0 flex-1">
              <span className={cn("os-tree-name", isFolder && "is-folder")}>{node.name}</span>
              {node.status && <span className="os-tree-status">{node.status}</span>}
              <span className="os-tree-meta">
                {node.type.toUpperCase()} / {node.modified ?? "unknown"} / {node.size ?? "1 KB"}
              </span>
              {node.description && <small>{node.description}</small>}
            </span>
          </>
        );

        return (
          <li key={path} className={cn("os-tree-item", isOpen && "is-active-folder")}>
            {isFolder ? (
              <button
                type="button"
                className="os-tree-row"
                aria-expanded={isOpen}
                onClick={() => toggleFolder(path)}
                data-sound-click="folder"
                data-sound-hover="tick"
              >
                {row}
              </button>
            ) : node.href ? (
              <Link
                href={node.href}
                target="_blank"
                rel="noopener noreferrer"
                className="os-tree-row"
                data-sound-click="nav"
                data-sound-hover="tick"
              >
                {row}
              </Link>
            ) : (
              <div className="os-tree-row" data-sound-hover="tick">
                {row}
              </div>
            )}

            {isFolder && (
              <div className={cn("os-tree-children", isOpen && "is-open")}>
                {node.href && (
                  <Link
                    href={node.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="os-tree-open-link"
                    data-sound-click="nav"
                    data-sound-hover="tick"
                  >
                    open repository
                  </Link>
                )}
                {node.children && (
                  <DirectoryBranch
                    nodes={node.children}
                    level={level + 1}
                    parentPath={path}
                    openFolders={openFolders}
                    toggleFolder={toggleFolder}
                  />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function ProjectsDirectory() {
  const defaultOpenFolders = useMemo(() => new Set(getFolderPaths(projectTree).slice(0, 3)), []);
  const [openFolders, setOpenFolders] = useState(defaultOpenFolders);

  function toggleFolder(path: string) {
    setOpenFolders((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  return (
    <DirectoryBranch
      nodes={projectTree}
      openFolders={openFolders}
      toggleFolder={toggleFolder}
    />
  );
}
