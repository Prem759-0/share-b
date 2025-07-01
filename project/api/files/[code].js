import { sql } from '@vercel/postgres';
import crypto from 'crypto';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

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

    if (req.method === 'GET') {
      // Check if password protected
      if (file.password_hash) {
        return res.status(401).json({ 
          requiresPassword: true,
          metadata: {
            originalName: file.original_name,
            size: file.size,
            mimeType: file.mime_type,
            uploadedAt: file.uploaded_at,
            expiresAt: file.expires_at,
            hasPassword: true
          }
        });
      }

      return res.status(200).json({
        id: file.id,
        code: file.code,
        originalName: file.original_name,
        filename: file.filename,
        size: file.size,
        mimeType: file.mime_type,
        uploadedAt: file.uploaded_at,
        expiresAt: file.expires_at,
        hasPassword: !!file.password_hash,
        downloadCount: file.download_count,
        maxDownloads: file.max_downloads
      });
    }

    if (req.method === 'POST') {
      const { password } = req.body;

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

      return res.status(200).json({
        id: file.id,
        code: file.code,
        originalName: file.original_name,
        filename: file.filename,
        size: file.size,
        mimeType: file.mime_type,
        uploadedAt: file.uploaded_at,
        expiresAt: file.expires_at,
        hasPassword: !!file.password_hash,
        downloadCount: file.download_count,
        maxDownloads: file.max_downloads
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('File retrieval error:', error);
    return res.status(500).json({ error: 'Failed to retrieve file' });
  }
}