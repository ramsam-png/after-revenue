import { put, head } from '@vercel/blob';

const PATHNAME = 'afterform/data.json';
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export default async function handler(req, res) {
  try {
    if (!BLOB_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN is missing');
    }

    if (req.method === 'GET') {
      try {
        const meta = await head(PATHNAME, {
          token: BLOB_TOKEN,
        });

        const r = await fetch(meta.url, {
          cache: 'no-store',
        });

        const data = r.ok ? await r.json() : null;

        res.status(200).json(data);
      } catch (e) {
        // No saved file yet
        res.status(200).json(null);
      }

      return;
    }

    if (req.method === 'POST') {
      const body =
        req.body && typeof req.body === 'object'
          ? req.body
          : JSON.parse(req.body || '{}');

      await put(PATHNAME, JSON.stringify(body), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        token: BLOB_TOKEN,
      });

      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({
      error: 'Method not allowed',
    });
  } catch (err) {
    res.status(500).json({
      error: 'Storage error',
      detail: String(err),
    });
  }
}
