import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { data, fmtDate, getProject, hostOf } from "@/lib/data";
import { LivePreview } from "@/components/LivePreview";
import { ShipRow } from "@/components/ShipRow";

export function generateStaticParams() {
  return data.projects.map((p) => ({ name: p.name }));
}

export async function generateMetadata({ params }: PageProps<"/p/[name]">): Promise<Metadata> {
  const { name } = await params;
  const p = getProject(name);
  return { title: p ? `${p.name} · quirq space` : "Not found" };
}

export default async function ProjectPage({ params }: PageProps<"/p/[name]">) {
  const { name } = await params;
  const p = getProject(name);
  if (!p) notFound();

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:text-primary">
        ← All projects
      </Link>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr]">
        <LivePreview name={p.name} url={p.url} shot={p.shot} />

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{p.name}</h1>
            {p.blurb && <p className="mt-2 text-secondary">{p.blurb}</p>}
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            {p.url && (
              <>
                <dt className="text-muted">Live</dt>
                <dd>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {hostOf(p.url)} ↗
                  </a>
                </dd>
              </>
            )}
            {p.repoUrl && (
              <>
                <dt className="text-muted">Source</dt>
                <dd>
                  <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {p.repoUrl.replace("https://github.com/", "")} ↗
                  </a>
                </dd>
              </>
            )}
            {p.framework && (
              <>
                <dt className="text-muted">Framework</dt>
                <dd>{p.framework}</dd>
              </>
            )}
            <dt className="text-muted">On Vercel since</dt>
            <dd>{fmtDate(p.createdAt)}</dd>
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-secondary">Shipped</h2>
        {p.deployments.length ? (
          <ul className="rounded-xl border border-grid bg-card px-4">
            {p.deployments.map((s, i) => (
              <ShipRow key={`${s.createdAt}-${i}`} ship={s} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No deploys yet.</p>
        )}
      </section>
    </>
  );
}
