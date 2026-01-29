const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const token = process.env.GITHUB_TOKEN;
const repoId = process.env.REPO_ID;
const categoryId = process.env.CATEGORY_ID;

if (!owner || !repo || !token || !repoId || !categoryId) {
  console.error('Missing env. Required: REPO_OWNER, REPO_NAME, GITHUB_TOKEN, REPO_ID, CATEGORY_ID');
  process.exit(1);
}

const ghHeaders = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  'User-Agent': 'imboni-blog-discussions'
};

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, { ...options, headers: { ...ghHeaders, ...(options.headers || {}) } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
};

const listIssues = async () => {
  const issues = [];
  let page = 1;
  while (true) {
    const data = await fetchJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`
    );
    if (!Array.isArray(data) || data.length === 0) break;
    for (const item of data) {
      if (item.pull_request) continue;
      const assoc = item.author_association || '';
      if (!['OWNER', 'MEMBER', 'COLLABORATOR'].includes(assoc)) continue;
      issues.push(item);
    }
    page += 1;
  }
  return issues;
};

const graphql = async (query, variables) => {
  return fetchJSON('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables })
  });
};

const searchDiscussion = async (title) => {
  const query = `query($q:String!){ search(query:$q, type:DISCUSSION, first:1) { nodes { ... on Discussion { id title } } } }`;
  const q = `repo:${owner}/${repo} type:discussion in:title "${title}"`;
  const data = await graphql(query, { q });
  return data?.data?.search?.nodes?.[0] || null;
};

const createDiscussion = async (title, body) => {
  const mutation = `mutation($input: CreateDiscussionInput!){
    createDiscussion(input:$input){
      discussion { id }
    }
  }`;
  const input = {
    repositoryId: repoId,
    categoryId,
    title,
    body
  };
  await graphql(mutation, { input });
};

const main = async () => {
  const issues = await listIssues();
  console.log(`Found ${issues.length} issues to sync`);

  for (const issue of issues) {
    const term = `post-${issue.number}`;
    const existing = await searchDiscussion(term);
    if (existing) {
      console.log(`skip ${term} (exists)`);
      continue;
    }
    const body = `Discussion for post #${issue.number}\n\n${issue.html_url}`;
    await createDiscussion(term, body);
    console.log(`created ${term}`);
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
