import ProjectsDirectory from "@/components/ProjectsDirectory";

export const metadata = {
  title: "Projects | Sercan Duran",
  description: "Project directory.",
};

export default function ProjectsPage() {
  return (
    <div className="grid gap-6 pb-20">
      <section className="system-window">
        <div className="system-titlebar">
          <span>DIRECTORY - /projects</span>
          <span>3 ENTRIES</span>
        </div>
        <div className="system-content">
          <h1 className="text-3xl font-bold sm:text-5xl">Projects tree</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            Projects are stored like a small operating system directory: one
            active build, a few logs, and a suspicious amount of unfinished ideas.
          </p>
        </div>
      </section>

      <section className="system-window">
        <div className="system-titlebar">
          <span>tree /f</span>
          <span>READ ONLY</span>
        </div>
        <div className="system-content">
          <ProjectsDirectory />
        </div>
      </section>
    </div>
  );
}
