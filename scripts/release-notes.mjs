import fs from 'node:fs/promises';

const tag = process.argv[2];
if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag || '')) {
  throw new Error('Usage: node scripts/release-notes.mjs vMAJOR.MINOR.PATCH');
}

const changelog = await fs.readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const lines = changelog.split(/\r?\n/);
const heading = `## [${tag.slice(1)}]`;
const start = lines.findIndex((line) => line === heading || line.startsWith(`${heading} - `));
if (start === -1) throw new Error(`Missing CHANGELOG.md entry for ${tag}`);
const next = lines.findIndex((line, index) => index > start && line.startsWith('## '));
const notes = lines.slice(start + 1, next === -1 ? undefined : next).join('\n').trim();
if (!notes) throw new Error(`Empty CHANGELOG.md entry for ${tag}`);
process.stdout.write(`${notes}\n`);
