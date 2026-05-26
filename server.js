import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { COLUMNS } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 스티비 주소록 연동 (값은 Railway 환경변수에서 주입)
const STIBEE_API_KEY = process.env.STIBEE_API_KEY;
const STIBEE_LIST_ID = process.env.STIBEE_LIST_ID;

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

// ━ 사전신청 → 스티비 주소록 구독자 추가 ━
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

app.post('/api/subscribe', async (req, res) => {
  try {
    const { name, email, phone, job, source, message, marketingConsent } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ ok: false, error: '이름을 입력해 주세요.' });
    }
    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ ok: false, error: '올바른 이메일 주소를 입력해 주세요.' });
    }
    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ ok: false, error: '연락처를 입력해 주세요.' });
    }
    if (!STIBEE_API_KEY || !STIBEE_LIST_ID) {
      console.error('Stibee env not configured');
      return res.status(503).json({ ok: false, error: '신청 기능이 아직 준비 중이에요. 잠시 후 다시 시도해 주세요.' });
    }

    // 스티비 커스텀 필드: 주소록에 동일한 이름의 필드를 만들어 두어야 매핑됩니다.
    const subscriber = {
      email: String(email).trim(),
      name: String(name).trim(),
      $ad_agreed: marketingConsent ? 'Y' : 'N',
      전화번호: String(phone).trim(),
    };
    if (job) subscriber['현재상황'] = String(job).trim();
    if (source) subscriber['유입경로'] = String(source).trim();
    if (message) subscriber['관심티어'] = String(message).trim();

    const r = await fetch(`https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        AccessToken: STIBEE_API_KEY,
      },
      body: JSON.stringify({
        eventOccuredBy: 'MANUAL',
        confirmEmailYN: 'N',
        subscribers: [subscriber],
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.Ok === false) {
      console.error('Stibee API error', r.status, JSON.stringify(data));
      return res.status(502).json({ ok: false, error: '신청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.' });
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error('subscribe error', e);
    return res.status(500).json({ ok: false, error: '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.' });
  }
});

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
