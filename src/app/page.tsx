import Link from "next/link";
import { data, hostOf, recentShips, type Project } from "@/lib/data";
import { ShipRow } from "@/components/ShipRow";
import { TimeAgo } from "@/components/TimeAgo";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const last = p.deployments[0];
  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl border border-grid bg-card transition-colors hover:border-axis">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-grid bg-surface">
        {p.shot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.shot}
            alt=""
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center font-mono text-sm text-muted">{p.name}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <Link href={`/p/${p.name}`} className="font-medium after:absolute after:inset-0">
            {p.name}
          </Link>
          {p.framework && <span className="text-xs text-muted">{p.framework}</span>}
        </div>
        {p.blurb && <p className="text-sm text-secondary">{p.blurb}</p>}
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
          {p.url && (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary">
              {hostOf(p.url)} ↗
            </a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary">
              Source ↗
            </a>
          )}
          {last && (
            <span className="ml-auto text-muted">
              shipped <TimeAgo ts={last.createdAt} />
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function Home() {
  const ships = recentShips(12);
  const live = data.projects.filter((p) => p.url).length;
  const activeDomains = data.domains.filter((d) => d.active);

  return (
    <>
      <section className="flex flex-col gap-6 pt-6">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Everything our space has shipped on Vercel.
        </h1>
        <p className="max-w-2xl text-secondary">
          Live projects, what changed in each deploy, and where they live. Open any of them, or try
          it right here.
        </p>
        <div className="flex flex-wrap gap-10 pt-2">
          <Stat label="live projects" value={live} />
          <Stat label="deploys" value={data.projects.reduce((n, p) => n + p.deployments.length, 0)} />
          <Stat label="domains" value={data.domains.length} />
          {ships[0] && <Stat label="last shipped" value={<TimeAgo ts={ships[0].createdAt} />} />}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-secondary">Projects</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-secondary">Recently shipped</h2>
          <ul className="rounded-xl border border-grid bg-card px-4">
            {ships.map((s, i) => (
              <ShipRow key={`${s.project}-${s.createdAt}-${i}`} ship={s} project={s.project} />
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-secondary">Domains</h2>
          <ul className="flex flex-col gap-2">
            {data.domains.map((d) => (
              <li key={d.name} className="flex items-center justify-between rounded-xl border border-grid bg-card px-4 py-3">
                <a
                  href={`https://${d.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {d.name}
                </a>
                <span className={`text-xs ${d.active ? "text-good" : "text-muted"}`}>
                  {d.active ? "● Active" : "○ Not configured"}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            {activeDomains.length} of {data.domains.length} active on {data.account.name}.
          </p>
        </div>
      </section>
    </>
  );
}
