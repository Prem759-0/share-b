# BoltAI - Secure File Sharing Platform

A modern, secure file-sharing application built with React, TypeScript, and Vercel serverless functions. Share files up to 2GB with unique 6-digit codes, password protection, and automatic expiration.

## Features

- **Easy File Upload**: Drag-and-drop interface supporting all file types up to 2GB
- **Secure Sharing**: Generate unique 6-digit codes with optional password protection
- **Fast Access**: Recipients can download files instantly using the share code
- **End-to-End Security**: Files are encrypted and automatically deleted after expiration
- **AI-Powered**: Smart file handling with natural language processing support
- **Global CDN**: Fast worldwide access through Vercel's edge network

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Vercel Postgres
- **Storage**: Vercel Blob Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Vercel CLI
- Vercel account with Postgres and Blob storage enabled

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   POSTGRES_URL=your_postgres_connection_string
   BLOB_READ_WRITE_TOKEN=your_blob_token
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

Run the SQL schema to create the required tables:

```sql
-- See schema.sql for complete setup
```

## Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Set up environment variables in Vercel dashboard:
   - `POSTGRES_URL`: Your Vercel Postgres connection string
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob storage token

## API Endpoints

- `POST /api/upload` - Upload a file
- `GET /api/files/[code]` - Get file metadata
- `POST /api/files/[code]` - Verify password and get file metadata
- `POST /api/download/[code]` - Download a file
- `POST /api/cleanup` - Clean up expired files (cron job)

## File Limits & Security

- **Free Tier**: 2GB max file size per upload
- **Storage**: Files automatically deleted after expiration (default 7 days)
- **Security**: End-to-end encryption, password protection, download limits
- **Privacy**: No file content analysis, GDPR compliant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For premium features and increased limits, visit: https://x.ai/grok