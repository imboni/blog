import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

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
  try {
    const { data } = await octokit.issues.listForRepo({
      owner: import.meta.env.VITE_REPO_OWNER,
      repo: import.meta.env.VITE_REPO_NAME,
      state: "all",
      filter: "created",
    });

    return data
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
        tags: issue.labels.map((l: any) => typeof l === 'string' ? l : l.name),
        user: issue.user?.login,
        avatar: issue.user?.avatar_url,
        date: new Date(issue.created_at).toLocaleDateString("zh-CN", {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
  } catch (error) {
    console.error("Fetch posts failed:", error);
    throw error;
  }
};
