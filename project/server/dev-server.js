import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
  },
});

// In-memory storage for development (replace with database in production)
const files = new Map();

// Generate share code
function generateShareCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const shareCode = generateShareCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const fileData = {
      id: uuidv4(),
      code: shareCode,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
      filePath: req.file.path,
      uploadedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      downloadCount: 0,
      hasPassword: false,
    };

    files.set(shareCode, fileData);

    res.json({
      code: shareCode,
      filename: req.file.originalname,
      url: `/share/${shareCode}`,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get file metadata
app.get('/api/files/:code', (req, res) => {
  try {
    const { code } = req.params;
    const fileData = files.get(code.toUpperCase());

    if (!fileData) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    // Check if expired
    if (new Date() > new Date(fileData.expiresAt)) {
      files.delete(code.toUpperCase());
      return res.status(404).json({ error: 'File expired' });
    }

    res.json({
      id: fileData.id,
      code: fileData.code,
      originalName: fileData.originalName,
      filename: fileData.filename,
      size: fileData.size,
      mimeType: fileData.mimeType,
      uploadedAt: fileData.uploadedAt,
      expiresAt: fileData.expiresAt,
      hasPassword: fileData.hasPassword,
      downloadCount: fileData.downloadCount,
    });
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
});

// Download file
app.post('/api/download/:code', (req, res) => {
  try {
    const { code } = req.params;
    const fileData = files.get(code.toUpperCase());

    if (!fileData) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    // Check if expired
    if (new Date() > new Date(fileData.expiresAt)) {
      files.delete(code.toUpperCase());
      return res.status(404).json({ error: 'File expired' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(fileData.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Increment download count
    fileData.downloadCount++;
    files.set(code.toUpperCase(), fileData);

    // Set headers for file download
    res.setHeader('Content-Type', fileData.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalName}"`);
    res.setHeader('Content-Length', fileData.size);

    // Stream the file
    const fileStream = fs.createReadStream(fileData.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Development server running' });
});

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
});