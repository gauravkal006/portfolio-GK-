import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { profile } from "../data/profile";
import { useSectionReveal } from "../hooks/useSectionReveal";
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

// Language swatches drawn from the site palette, assigned by rank so the bar always harmonises.
const swatches = ["var(--color-accent)", "var(--color-olive)", "var(--color-mustard)", "var(--color-slate)", "var(--color-ink)", "var(--color-line-strong)"];
const swatch = (rank: number) => swatches[Math.min(rank, swatches.length - 1)];

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
  const rank = new Map(languages.map((l, i) => [l.name, i]));
  const totalStars = data ? data.repos.reduce((sum, r) => sum + r.stargazers_count, 0) : 0;
  const loading = !data && state.status !== "error";

  return (
    <section ref={ref} id="github" aria-labelledby="github-title" className="relative py-14 md:py-20">
      <div className="container-page">
        <SectionHeading
          index="04"
          kicker="Open source"
          aside="Updated on every visit"
          id="github-title"
          title={
            <>
              Live from <em className="text-accent">GitHub</em>
            </>
          }
        />

        <div className="grid gap-14 md:grid-cols-12 md:gap-6" aria-busy={state.status === "loading"}>
          <div data-reveal className="md:col-span-4">
            <dl className="grid grid-cols-2 border-t border-ink">
              <Stat label="Public repositories" value={data?.publicRepos} loading={loading} />
              <Stat label="Stars on own repos" value={data ? totalStars : undefined} loading={loading} divider />
            </dl>

            <div className="mt-8">
              <p className="label">Primary language by repo</p>
              {data ? (
                <>
                  <div className="mt-3 flex h-3 overflow-hidden border border-ink" role="img" aria-label={languages.map((l) => `${l.name} ${l.count}`).join(", ")}>
                    {languages.map((l, i) => (
                      <span key={l.name} style={{ width: `${l.share}%`, background: swatch(i) }} />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.9rem]">
                    {languages.map((l, i) => (
                      <li key={l.name} className="flex items-center gap-2 text-muted">
                        <span className="size-2.5 shrink-0" style={{ background: swatch(i) }} aria-hidden="true" />
                        <span className="truncate">{l.name}</span>
                        <span className="ml-auto text-[0.9rem]">{l.count}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="skeleton mt-3 h-3" />
              )}
            </div>

            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-arrow mt-8">
              github.com/{profile.githubUser} <ArrowUpRight size={16} aria-hidden="true" className="arrow-ur" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div data-reveal className="md:col-span-8">
            <div className="flex min-h-10 items-center justify-between border-b border-ink pb-1">
              <h3 className="font-serif text-[1.25rem] italic">Recently updated repositories</h3>
              {data && (
                <button
                  type="button"
                  onClick={load}
                  className="grid size-10 place-items-center text-muted transition-colors hover:text-accent-ink"
                  aria-label="Refresh GitHub data"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            {state.status === "error" ? (
              <div role="alert" className="border-b border-line py-8">
                <p className="font-serif text-[1.25rem]">Couldn't load live GitHub data.</p>
                <p className="mt-2 max-w-lg text-[0.95rem] text-muted">
                  {state.message} The projects above are always available, and everything is on GitHub.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-7">
                  <button type="button" onClick={load} className="link-arrow">
                    <RefreshCw size={15} aria-hidden="true" /> Try again
                  </button>
                  <a href={`${profile.github}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="link-arrow">
                    Open on GitHub <ArrowUpRight size={15} aria-hidden="true" className="arrow-ur" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            ) : data ? (
              <ul className="grid sm:grid-cols-2 sm:gap-x-8">
                {data.repos.slice(0, 8).map((repo) => (
                  <li key={repo.name} className="border-b border-line">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col py-4">
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0 truncate font-mono text-[0.9rem] font-medium transition-colors group-hover:text-accent-ink" title={repo.name}>
                          {repo.name}
                        </span>
                        <ArrowUpRight
                          size={15}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                      </span>
                      {repo.description && <span className="mt-1 line-clamp-2 text-[0.9rem] text-muted">{repo.description}</span>}
                      <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2.5 text-[0.88rem] text-muted">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span className="size-2" style={{ background: swatch(rank.get(repo.language) ?? swatches.length) }} aria-hidden="true" />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && <span aria-label={`${repo.stargazers_count} stars`}>★ {repo.stargazers_count}</span>}
                        {repo.forks_count > 0 && <span>{repo.forks_count} {repo.forks_count === 1 ? "fork" : "forks"}</span>}
                        <span>Updated {relative(repo.pushed_at)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid sm:grid-cols-2 sm:gap-x-8" aria-label="Loading repositories">
                {Array.from({ length: 6 }, (_, i) => (
                  <li key={i} className="space-y-2.5 border-b border-line py-4">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-1/2" />
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

function Stat({ label, value, loading, divider = false }: { label: string; value?: number; loading: boolean; divider?: boolean }) {
  return (
    <div className={`flex flex-col justify-between border-b border-line py-4 pr-4 ${divider ? "border-l pl-4" : ""}`}>
      <dt className="label">{label}</dt>
      <dd className="display mt-2 text-[3rem] leading-none">
        {value !== undefined ? value : loading ? <span className="skeleton inline-block h-10 w-14 align-middle" /> : "–"}
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
