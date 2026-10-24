import snapshot from "@/data/snapshot.json";

// The site renders only this committed snapshot (see scripts/snapshot.mjs):
// no API calls and no tokens at runtime.

export type DeployState = "READY" | "ERROR" | "BUILDING" | "QUEUED" | "CANCELED" | "OTHER";

export type Ship = {
  state: DeployState;
  production: boolean;
  createdAt: number;
  durationMs: number | null;
  branch: string | null;
  sha: string | null;
  message: string | null;
  commitUrl: string | null;
};

export type Project = {
  name: string;
  blurb: string | null;
  framework: string | null;
  url: string | null;
  repoUrl: string | null;
  createdAt: number;
  shot: string | null;
  deployments: Ship[];
};

export type Domain = {
  name: string;
  active: boolean;
  dns: string;
  addedAt: number;
};

export type Snapshot = {
  takenAt: number;
  account: { name: string; createdAt: number | null };
  projects: Project[];
  domains: Domain[];
};

export const data = snapshot as Snapshot;

export const GITHUB_PORTFOLIO = "https://github-activity-bay.vercel.app";

export function getProject(name: string): Project | undefined {
  return data.projects.find((p) => p.name === name);
}

export function recentShips(limit: number) {
  return data.projects
    .flatMap((p) => p.deployments.map((d) => ({ ...d, project: p.name })))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

export function hostOf(url: string) {
  return new URL(url).host;
}

export function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function fmtDuration(ms: number | null) {
  if (ms === null) return null;
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
}
