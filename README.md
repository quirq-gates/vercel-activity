# vercel-activity

A portfolio of everything our space ships on Vercel (team `quirq-research`):
live projects with screenshots and a "Try it here" embed, what changed in each
deploy, and the team's domains. Its GitHub twin is
[github-activity](https://github.com/quirq-gates/github-activity).

The site is fully static. It holds no tokens and calls no API at runtime: it
renders `src/data/snapshot.json`, which `npm run snapshot` builds on a machine
where the Vercel CLI is logged in.

## Update the portfolio

1. Edit `src/data/showcase.json` to choose which projects appear, in what order,
   with optional one-line blurbs.
2. `npm run snapshot` refreshes the data and the screenshots in `public/shots/`.
   Pass `-- --no-shots` to keep the old screenshots.
3. Commit, then deploy: `vercel deploy --prod --scope quirq-research`.

## What the snapshot keeps

Project name, blurb, framework, public URL, GitHub link (public repos only),
screenshot, and for each deploy: state, production or preview, time, build
duration, branch, short SHA, and the commit title (public repos only). Domains:
name, status, DNS provider.

It never keeps env vars, preview or team-slug URLs, IDs, usernames, emails or
commit bodies.
