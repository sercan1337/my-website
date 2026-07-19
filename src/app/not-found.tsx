import Link from "next/link";

const errorArt = String.raw`
  ___   ___  _  _
 / _ \ / _ \| || |
| | | | | | | || |_
| |_| | |_| |__   _|
 \___/ \___/   |_|
`;

export default function NotFound() {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] place-items-center pb-20">
      <section className="system-window w-full max-w-3xl">
        <div className="system-titlebar">
          <span>SYSTEM ERROR</span>
          <span>404</span>
        </div>
        <div className="system-content text-center">
          <pre className="ascii-logo" aria-label="404 ASCII art">
            {errorArt}
          </pre>

          <h1 className="mt-6 text-3xl font-bold sm:text-5xl">
            Sector not found.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/72">
            The requested route could not be resolved. The archive might be
            corrupted, renamed, or hidden behind another command.
          </p>

          <div className="mx-auto mt-8 grid max-w-xl gap-2 text-left text-sm text-white/72">
            <p>{"> error_code: 404"}</p>
            <p>{"> module: route_lookup"}</p>
            <p>{"> recovery: return to boot menu"}</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="retro-command p-3">
              return home
            </Link>
            <Link href="/blog" className="retro-command p-3">
              open posts.dir
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
