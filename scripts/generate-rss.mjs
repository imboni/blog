import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const loadEnvFile = async (filename) => {
  const envPath = path.join(root, filename);
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    return raw
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .reduce((acc, line) => {
        const idx = line.indexOf('=');
        if (idx === -1) return acc;
        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        acc[key] = value;
        return acc;
      }, {});
  } catch (_) {
    return {};
  }
};

const env = {
  ...(await loadEnvFile('.env')),
  ...(await loadEnvFile('.env.local')),
  ...process.env,
};

const owner = env.VITE_REPO_OWNER;
const repo = env.VITE_REPO_NAME;
const token = env.VITE_GITHUB_TOKEN;

if (!owner || !repo) {
  console.error('Missing env. Required: VITE_REPO_OWNER, VITE_REPO_NAME');
  process.exit(1);
}

const siteConfigPath = path.join(root, 'public', 'site.config.json');
const siteConfigRaw = await fs.readFile(siteConfigPath, 'utf8');
const siteConfig = JSON.parse(siteConfigRaw);

const siteTitle = siteConfig.siteTitle || 'Blog';
const siteDescription = siteConfig.tagline || siteConfig.intro || 'Updates';
const siteUrl = (env.VITE_SITE_URL || siteConfig.siteUrl || '').replace(/\/$/, '');

if (!siteUrl) {
  console.error('Missing siteUrl. Please set "siteUrl" in public/site.config.json or VITE_SITE_URL in env.');
  process.exit(1);
}

const ghHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'imboni-blog-rss',
};
if (token) {
  ghHeaders.Authorization = `Bearer ${token}`;
}

const fetchJSON = async (url) => {
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${text}`);
  }
  return res.json();
};

const listIssues = async () => {
  const issues = [];
  let page = 1;
  while (true) {
    const data = await fetchJSON(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}&sort=created&direction=desc`
    );
    if (!Array.isArray(data) || data.length === 0) break;
    for (const issue of data) {
      if (issue.pull_request) continue;
      const assoc = issue.author_association || '';
      if (!['OWNER', 'MEMBER', 'COLLABORATOR'].includes(assoc)) continue;
      issues.push(issue);
    }
    if (data.length < 100) break;
    page += 1;
  }
  return issues;
};

const escapeXml = (value) => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const wrapCdata = (value) => {
  const safe = String(value).replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${safe}]]>`;
};

const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, ' ');
};

const toSummary = (html, limit = 240) => {
  const text = stripHtml(html).replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
};

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
const issues = await listIssues();
const items = issues.map((issue) => {
  const postUrl = `${siteUrl}/post/${issue.number}`;
  const contentHtml = md.render(issue.body || '');
  const summary = toSummary(contentHtml);
  const categories = (issue.labels || [])
    .map((label) => (typeof label === 'string' ? label : label?.name))
    .filter(Boolean);
  const pubDate = new Date(issue.created_at).toUTCString();
  return [
    '    <item>',
    `      <title>${escapeXml(issue.title)}</title>`,
    `      <link>${escapeXml(postUrl)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    `      <description>${wrapCdata(summary)}</description>`,
    ...categories.map((category) => `      <category>${escapeXml(category)}</category>`),
    `      <content:encoded>${wrapCdata(contentHtml)}</content:encoded>`,
    '    </item>',
  ].join('\n');
});

const lastBuildDate = issues.reduce((latest, issue) => {
  const date = new Date(issue.updated_at || issue.created_at);
  return date > latest ? date : latest;
}, new Date(0));

const feedUrl = `${siteUrl}/rss.xml`;
const rss = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
  '  <channel>',
  `    <title>${escapeXml(siteTitle)}</title>`,
  `    <link>${escapeXml(siteUrl)}</link>`,
  `    <description>${escapeXml(siteDescription)}</description>`,
  '    <language>zh-CN</language>',
  `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
  `    <lastBuildDate>${(issues.length ? lastBuildDate : new Date()).toUTCString()}</lastBuildDate>`,
  items.join('\n'),
  '  </channel>',
  '</rss>',
  '',
].join('\n');

const outputPath = path.join(root, 'public', 'rss.xml');
await fs.writeFile(outputPath, rss, 'utf8');
console.log(`RSS generated: ${outputPath}`);
