import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { password } = req.body;

  if (!code || code.length !== 6) {
    return res.status(400).json({ error: 'Invalid share code' });
  }

  try {
    // Get file metadata
    const result = await sql`
      SELECT * FROM files 
      WHERE code = ${code.toUpperCase()} 
      AND expires_at > NOW()
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    const file = result.rows[0];

    // Check download limits
    if (file.max_downloads && file.download_count >= file.max_downloads) {
      return res.status(403).json({ error: 'Download limit exceeded' });
    }

    // Verify password if required
    if (file.password_hash) {
      if (!password) {
        return res.status(400).json({ error: 'Password required' });
      }

      const hashedPassword = crypto
        .pbkdf2Sync(password, file.id, 10000, 64, 'sha512')
        .toString('hex');

      if (hashedPassword !== file.password_hash) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Increment download count
    await sql`
      UPDATE files 
      SET download_count = download_count + 1 
      WHERE id = ${file.id}
    `;

    // Fetch file from Vercel Blob
    const response = await fetch(file.blob_url);
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch file' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Length', file.size);

    // Stream the file
    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Download failed' });
  }
}