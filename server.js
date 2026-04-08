import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { COLUMNS } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const SITE_URL = process.env.SITE_URL || 'https://sap-website-production.up.railway.app';
const SITE_TITLE = '조용한 야망가들 (Silent Ambitious People)';
const SITE_DESC = '영어, 커리어, 시스템에 대한 솔직한 이야기.';

const escapeXml = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const buildRss = () => {
  const sorted = [...COLUMNS].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const items = sorted.map((c) => {
    const link = `${SITE_URL}/#${c.id}`;
    const pubDate = new Date(`${c.date}T09:00:00+09:00`).toUTCString();
    return `    <item>
      <title>${escapeXml(c.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(c.id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(c.tag || '')}</category>
      <description>${escapeXml(c.summary || '')}</description>
      <content:encoded><![CDATA[<p>${escapeXml(c.summary || '')}</p><pre style="white-space:pre-wrap;font-family:sans-serif">${escapeXml(c.content || '')}</pre><p><a href="${escapeXml(link)}">전체 읽기 →</a></p>]]></content:encoded>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESC)}</description>
    <language>ko</language>
    <atom:link href="${escapeXml(SITE_URL)}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
};

app.get('/rss.xml', (req, res) => {
  res.set('Content-Type', 'application/rss+xml; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=600');
  res.send(buildRss());
});

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
