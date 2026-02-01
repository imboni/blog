const apiBase = 'https://api.github.com';
const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
const owner = import.meta.env.VITE_REPO_OWNER as string;
const repo = import.meta.env.VITE_REPO_NAME as string;
const postsCache = new Map<string, Promise<Post[]>>();

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  date: string;
  user?: string;
  avatar?: string;
}

export const getPosts = async (type: 'blog' | 'message' = 'blog'): Promise<Post[]> => {
  if (postsCache.has(type)) return postsCache.get(type)!;
  const request = (async () => {
    try {
      if (!owner || !repo) {
        throw new Error('Missing repo configuration.');
      }
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(
        `${apiBase}/repos/${owner}/${repo}/issues?state=all&filter=created&per_page=100`,
        { headers }
      );
      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }
      const data = await res.json();
      return (Array.isArray(data) ? data : [])
        .filter((issue) => {
          const isPullRequest = Boolean(issue.pull_request);
          if (isPullRequest) return false;
          const isMaintainer = ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(issue.author_association || '');
          return type === 'blog' ? isMaintainer : !isMaintainer;
        })
        .map((issue) => ({
          id: issue.number,
          title: issue.title,
          body: issue.body || "",
          tags: (issue.labels || [])
            .map((label: any) => (typeof label === 'string' ? label : label?.name))
            .filter(Boolean),
          user: issue.user?.login,
          avatar: issue.user?.avatar_url,
          date: new Date(issue.created_at).toLocaleDateString("zh-CN", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }));
    } catch (error) {
      postsCache.delete(type);
      console.error("Fetch posts failed:", error);
      throw error;
    }
  })();
  postsCache.set(type, request);
  return request;
};
