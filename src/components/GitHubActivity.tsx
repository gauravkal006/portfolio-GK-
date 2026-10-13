import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CircleAlert, Clock, GitFork, RefreshCw, Star } from "lucide-react";
import { profile } from "../data/profile";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { spotlightMove } from "../lib/spotlight";
import { GitHubIcon } from "./BrandIcons";
import { SectionHeading } from "./SectionHeading";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
};
type GitHubData = { publicRepos: number; repos: Repo[]; fetchedAt: number };
type State = { status: "idle" | "loading" } | { status: "error"; message: string } | { status: "ready"; data: GitHubData };

const CACHE_KEY = "gh-activity-v1";
const CACHE_MS = 60 * 60 * 1000;
const API = "https://api.github.com";

const langColor: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  HTML: "#e34c26",
  SCSS: "#c6538c",
  "Jupyter Notebook": "#DA5B0B",
  CSS: "#663399",
};

function readCache(): GitHubData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GitHubData;
    return Date.now() - data.fetchedAt < CACHE_MS ? data : null;
  } catch {
    return null;
  }
}

async function fetchGitHub(signal: AbortSignal): Promise<GitHubData> {
  const opts = { signal, headers: { Accept: "application/vnd.github+json" } };
  const [userRes, repoRes] = await Promise.all([
    fetch(`${API}/users/${profile.githubUser}`, opts),
    fetch(`${API}/users/${profile.githubUser}/repos?per_page=100&sort=pushed`, opts),
  ]);
  for (const res of [userRes, repoRes]) {
    if (res.status === 403 || res.status === 429) throw new Error("GitHub's public API rate limit was reached. Please try again in a little while.");
    if (!res.ok) throw new Error(`GitHub responded with ${res.status}.`);
  }
  const user = (await userRes.json()) as { public_repos: number };
  const repos = ((await repoRes.json()) as Repo[]).filter((r) => !r.fork && r.name !== profile.githubUser);
  const data = { publicRepos: user.public_repos, repos, fetchedAt: Date.now() };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: fine, we just refetch next time */
  }
  return data;
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function relative(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "just now";
}

export function GitHubActivity() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>(() => {
    const cached = readCache();
    return cached ? { status: "ready", data: cached } : { status: "idle" };
  });
  const abortRef = useRef<AbortController | null>(null);

  useSectionReveal(ref);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: "loading" });
    fetchGitHub(controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", message: err instanceof Error ? err.message : "Could not reach GitHub." });
      });
  }, []);

  // Only call the API once the section is close to the viewport.
  useEffect(() => {
    if (state.status !== "idle" || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [state.status, load]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const data = state.status === "ready" ? state.data : null;
  const languages = data ? languageBreakdown(data.repos) : [];
  const totalStars = data ? data.repos.reduce((sum, r) => sum + r.stargazers_count, 0) : 0;

  return (
    <section ref={ref} id="github" aria-labelledby="github-title" className="relative py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          index="04"
          kicker="Open source"
          id="github-title"
          title="Live from GitHub"
          note="Pulled from GitHub's public API when you visit, so it is always current. Forks are left out."
        />

        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]" aria-busy={state.status === "loading"}>
          <div data-reveal className="panel flex flex-col p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full border border-line-strong bg-white/[0.03]">
                <GitHubIcon size={20} />
              </span>
              <div>
                <p className="font-display font-semibold">{profile.githubUser}</p>
                <p className="text-sm text-muted">{profile.name}</p>
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-3">
              <Stat label="Public repositories" value={data?.publicRepos} loading={!data && state.status !== "error"} />
              <Stat label="Stars on own repos" value={data ? totalStars : undefined} loading={!data && state.status !== "error"} />
            </dl>

            <div className="mt-7">
              <p className="font-mono text-[0.7rem] tracking-[0.08em] text-subtle uppercase">Primary language by repo</p>
              {data ? (
                <>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/5" role="img" aria-label={languages.map((l) => `${l.name} ${l.count}`).join(", ")}>
                    {languages.map((l) => (
                      <span key={l.name} style={{ width: `${l.share}%`, background: langColor[l.name] ?? "#6f7781" }} />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {languages.map((l) => (
                      <li key={l.name} className="flex items-center gap-2 text-muted">
                        <span className="size-2 shrink-0 rounded-full" style={{ background: langColor[l.name] ?? "#6f7781" }} aria-hidden="true" />
                        <span className="truncate">{l.name}</span>
                        <span className="ml-auto font-mono text-xs text-subtle">{l.count}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="skeleton mt-3 h-2 rounded-full" />
              )}
            </div>

            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8 self-start">
              View GitHub profile <ArrowUpRight size={16} aria-hidden="true" className="arrow-ur" />
            </a>
          </div>

          <div data-reveal className="panel p-2 sm:p-3">
            <div className="flex items-center justify-between px-3 pt-3 pb-2 sm:px-4">
              <h3 className="font-display text-[1.05rem] font-semibold">Recently updated repositories</h3>
              {data && (
                <button
                  type="button"
                  onClick={load}
                  className="grid size-9 place-items-center rounded-full text-subtle transition-colors hover:bg-white/5 hover:text-ink"
                  aria-label="Refresh GitHub data"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            {state.status === "error" ? (
              <div role="alert" className="m-2 flex flex-col items-start gap-4 rounded-xl border border-line bg-white/[0.02] p-6">
                <CircleAlert className="text-accent" size={22} aria-hidden="true" />
                <div>
                  <p className="font-medium">Couldn't load live GitHub data.</p>
                  <p className="mt-1 text-sm text-muted">{state.message} The projects above are always available, and everything is on GitHub.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={load} className="btn btn-ghost !min-h-10 !text-sm">
                    <RefreshCw size={15} aria-hidden="true" /> Try again
                  </button>
                  <a href={`${profile.github}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-10 !text-sm">
                    Open on GitHub <ArrowUpRight size={15} aria-hidden="true" className="arrow-ur" />
                  </a>
                </div>
              </div>
            ) : data ? (
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
                {data.repos.slice(0, 8).map((repo) => (
                  <li key={repo.name}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onPointerMove={spotlightMove}
                      className="spotlight group relative flex h-full flex-col rounded-xl border border-transparent p-4 transition-colors hover:border-line hover:bg-white/[0.02]"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0 truncate font-mono text-[0.9rem] font-medium text-ink group-hover:text-accent" title={repo.name}>{repo.name}</span>
                        <ArrowUpRight size={15} className="mt-0.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" aria-hidden="true" />
                      </span>
                      {repo.description && <span className="mt-1.5 line-clamp-2 text-sm text-muted">{repo.description}</span>}
                      <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-subtle">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full" style={{ background: langColor[repo.language] ?? "#6f7781" }} aria-hidden="true" />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1" aria-label={`${repo.stargazers_count} stars`}>
                            <Star size={12} aria-hidden="true" /> {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1" aria-label={`${repo.forks_count} forks`}>
                            <GitFork size={12} aria-hidden="true" /> {repo.forks_count}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} aria-hidden="true" /> Updated {relative(repo.pushed_at)}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2" aria-label="Loading repositories">
                {Array.from({ length: 6 }, (_, i) => (
                  <li key={i} className="space-y-3 rounded-xl p-4">
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.02] p-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold">
        {value !== undefined ? value : loading ? <span className="skeleton inline-block h-7 w-10 rounded align-middle" /> : "–"}
      </dd>
    </div>
  );
}

function languageBreakdown(repos: Repo[]) {
  const counts = new Map<string, number>();
  for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;
  return Array.from(counts, ([name, count]) => ({ name, count, share: (count / total) * 100 })).sort((a, b) => b.count - a.count);
}
