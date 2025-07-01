import { sql } from '@vercel/postgres';
import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Find expired files
    const expiredFiles = await sql`
      SELECT id, blob_url FROM files 
      WHERE expires_at < NOW()
    `;

    if (expiredFiles.rows.length === 0) {
      return res.status(200).json({ message: 'No expired files found' });
    }

    // Delete files from Vercel Blob
    const deletePromises = expiredFiles.rows.map(async (file) => {
      try {
        await del(file.blob_url);
      } catch (error) {
        console.error(`Failed to delete blob for file ${file.id}:`, error);
      }
    });

    await Promise.allSettled(deletePromises);

    // Remove from database
    await sql`
      DELETE FROM files WHERE expires_at < NOW()
    `;

    return res.status(200).json({ 
      message: `Cleaned up ${expiredFiles.rows.length} expired files` 
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return res.status(500).json({ error: 'Cleanup failed' });
  }
}