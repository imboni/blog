const apiBase = 'https://api.github.com';
const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
const owner = import.meta.env.VITE_REPO_OWNER as string;
const blogRepo = import.meta.env.VITE_REPO_NAME as string;

export interface Project {
  period: string;
  name: string;
  desc: string;
  href: string;
}

const excludedRepoNames = new Set(
  [blogRepo, 'imboni-blog', owner]
    .filter(Boolean)
    .map((name) => name.toLowerCase())
);

let projectsCache: Promise<Project[]> | null = null;

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function formatPeriod(createdAt: string, pushedAt: string): string {
  const createdYear = new Date(createdAt).getFullYear();
  const pushedYear = new Date(pushedAt).getFullYear();
  if (createdYear === pushedYear) {
    return String(createdYear);
  }
  return `${createdYear} — ${pushedYear}`;
}

export const getProjects = async (): Promise<Project[]> => {
  if (projectsCache) return projectsCache;

  projectsCache = (async () => {
    if (!owner) {
      throw new Error('Missing repo owner configuration.');
    }

    const res = await fetch(
      `${apiBase}/users/${owner}/repos?per_page=100&sort=updated&type=owner`,
      { headers: githubHeaders() }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((repo) => {
        if (repo.archived) return false;
        const name = String(repo.name || '').toLowerCase();
        return !excludedRepoNames.has(name);
      })
      .sort(
        (a, b) =>
          new Date(b.pushed_at || b.updated_at).getTime() -
          new Date(a.pushed_at || a.updated_at).getTime()
      )
      .map((repo) => ({
        period: formatPeriod(repo.created_at, repo.pushed_at || repo.updated_at),
        name: repo.name,
        desc: repo.description?.trim() || '',
        href: repo.html_url,
      }));
  })();

  try {
    return await projectsCache;
  } catch (error) {
    projectsCache = null;
    console.error('Fetch projects failed:', error);
    throw error;
  }
};
