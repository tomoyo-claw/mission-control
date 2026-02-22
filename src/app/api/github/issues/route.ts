import { NextResponse } from "next/server";

const REPOS = ["tomoyo-claw/mission-control", "tomoyo-claw/steam-game-hub"];
const TOKEN = process.env.GITHUB_TOKEN;

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: { name: string; color: string }[];
  user: { login: string; avatar_url: string };
  body: string | null;
  pull_request?: unknown;
}

async function fetchIssues(repo: string): Promise<GitHubIssue[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(
    `https://api.github.com/repos/${repo}/issues?state=open&per_page=20&sort=updated`,
    { headers, next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data: GitHubIssue[] = await res.json();
  // issues のみ（PR除外）
  return data.filter((i) => !i.pull_request).map((i) => ({
    ...i,
    repo,
  }));
}

export async function GET() {
  try {
    const results = await Promise.all(REPOS.map(fetchIssues));
    const issues = results
      .flat()
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return NextResponse.json({ issues, repos: REPOS });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
