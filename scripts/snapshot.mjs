#!/usr/bin/env node
// Builds src/data/snapshot.json and public/shots/*.jpg from the Vercel team
// named in src/data/showcase.json. Runs on a workstation with the Vercel CLI
// logged in; the deployed site never calls an API or holds a token.
//
//   npm run snapshot            # data + screenshots
//   npm run snapshot -- --no-shots

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const showcase = JSON.parse(readFileSync(join(root, "src/data/showcase.json"), "utf8"));
const team = showcase.team;
const withShots = !process.argv.includes("--no-shots");
const HISTORY = 25;

function vercel(path) {
  const sep = path.includes("?") ? "&" : "?";
  const out = execFileSync(
    "vercel",
    ["api", `${path}${sep}slug=${encodeURIComponent(team)}`, "--non-interactive"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 << 20 },
  );
  return JSON.parse(out);
}

// Anonymous on purpose: a repo counts as public only if GitHub shows it to
// anyone. Any failure means "treat as private".
async function publicRepo(org, repo) {
  try {
    const res = await fetch(`https://api.github.com/repos/${org}/${repo}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "vercel-activity-snapshot" },
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (body.private !== false) return null;
    return { url: body.html_url, description: body.description || null };
  } catch {
    return null;
  }
}

function repoOf(p) {
  if (p.link?.type === "github" && p.link.org && p.link.repo) return { org: p.link.org, repo: p.link.repo };
  const meta = p.latestDeployments?.[0]?.meta;
  if (meta?.githubCommitOrg && meta.githubCommitRepo) {
    return { org: meta.githubCommitOrg, repo: meta.githubCommitRepo };
  }
  return null;
}

// A custom domain if there is one, else the short production *.vercel.app
// alias. Standard Protection leaves that alias public; the ones carrying the
// team slug or a branch name stay behind Vercel Authentication.
function liveUrl(p, teamSlug) {
  const aliases = [...new Set(p.targets?.production?.alias ?? [])].sort((a, b) => a.length - b.length);
  const custom = aliases.find((d) => !d.endsWith(".vercel.app"));
  if (custom) return `https://${custom}`;
  const sso = p.ssoProtection?.deploymentType;
  if (p.passwordProtection || (sso && sso !== "all_except_custom_domains" && sso !== "preview")) return null;
  const alias = aliases.find((d) => !d.includes("-git-") && !d.includes(teamSlug));
  return alias ? `https://${alias}` : null;
}

function state(s) {
  return ["READY", "ERROR", "BUILDING", "QUEUED", "CANCELED"].includes(s) ? s : "OTHER";
}

function firstLine(s) {
  const line = s?.split("\n")[0]?.trim();
  if (!line) return null;
  return line.length > 120 ? `${line.slice(0, 117)}…` : line;
}

async function screenshot(browser, url, file) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
    if (!res || !res.ok()) return false;
    await page.waitForTimeout(1500);
    await page.screenshot({ path: file, type: "jpeg", quality: 80 });
    return true;
  } catch {
    return false;
  } finally {
    await page.close();
  }
}

const info = vercel(`/v2/teams/${encodeURIComponent(team)}`);
const allProjects = vercel("/v10/projects?limit=100").projects;
const domains = vercel("/v5/domains?limit=100").domains;

const projects = [];
for (const entry of showcase.projects) {
  const p = allProjects.find((x) => x.name === entry.name);
  if (!p) {
    console.warn(`skip ${entry.name}: not in ${team}`);
    continue;
  }
  const r = repoOf(p);
  const gh = r ? await publicRepo(r.org, r.repo) : null;
  const deployments = vercel(`/v6/deployments?projectId=${p.id}&limit=${HISTORY}`)
    .deployments.map((d) => {
      const meta = d.meta ?? {};
      const start = d.buildingAt ?? d.created;
      return {
        state: state(d.readyState ?? d.state),
        production: d.target === "production",
        createdAt: d.created,
        durationMs: d.ready && d.ready >= start ? d.ready - start : null,
        branch: meta.githubCommitRef ?? null,
        sha: meta.githubCommitSha ? meta.githubCommitSha.slice(0, 7) : null,
        message: gh ? firstLine(meta.githubCommitMessage) : null,
        commitUrl: gh && meta.githubCommitSha ? `${gh.url}/commit/${meta.githubCommitSha}` : null,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
  projects.push({
    name: p.name,
    blurb: entry.blurb ?? gh?.description ?? null,
    framework: p.framework ?? null,
    url: liveUrl(p, info.slug),
    repoUrl: gh?.url ?? null,
    createdAt: p.createdAt,
    shot: null,
    deployments,
  });
}

if (withShots) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const dir = join(root, "public/shots");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const p of projects) {
    if (!p.url) continue;
    const file = `${p.name}.jpg`;
    if (await screenshot(browser, p.url, join(dir, file))) p.shot = `/shots/${file}`;
    console.log(`${p.name}: ${p.shot ? "screenshot" : "no screenshot"}`);
  }
  await browser.close();
} else {
  // Keep the screenshots from the previous snapshot.
  try {
    const prev = JSON.parse(readFileSync(join(root, "src/data/snapshot.json"), "utf8"));
    for (const p of projects) p.shot = prev.projects.find((x) => x.name === p.name)?.shot ?? null;
  } catch {}
}

const snapshot = {
  takenAt: Date.now(),
  account: { name: info.name ?? team, createdAt: info.createdAt ?? null },
  projects,
  domains: domains
    .map((d) => ({
      name: d.name,
      active: Boolean(d.verified && (d.configVerifiedAt || d.nsVerifiedAt)),
      dns: d.nameservers?.some((n) => n.endsWith("vercel-dns.com")) ? "Vercel DNS" : "External DNS",
      addedAt: d.createdAt,
    }))
    .sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name)),
};

writeFileSync(join(root, "src/data/snapshot.json"), JSON.stringify(snapshot, null, 2) + "\n");
console.log(`wrote ${projects.length} projects, ${snapshot.domains.length} domains`);
