import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

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

  try {
    // Parse multipart form data (simplified for demo)
    const file = req.body; // In real implementation, use a proper multipart parser
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        error: 'File size exceeds 2GB limit. Please compress or upgrade your plan.' 
      });
    }

    // Generate unique identifiers
    const fileId = uuidv4();
    const shareCode = generateShareCode();
    const filename = `${fileId}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file.stream, {
      access: 'public',
    });

    // Calculate expiration (default 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store metadata in database
    await sql`
      INSERT INTO files (
        id, code, original_name, filename, size, mime_type, 
        blob_url, uploaded_at, expires_at, download_count
      ) VALUES (
        ${fileId}, ${shareCode}, ${file.name}, ${filename}, 
        ${file.size}, ${file.type}, ${blob.url}, NOW(), 
        ${expiresAt.toISOString()}, 0
      )
    `;

    return res.status(200).json({
      code: shareCode,
      filename: file.name,
      url: `/share/${shareCode}`,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

function generateShareCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}