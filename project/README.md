# ShareAnywhere - File Sharing System

A secure file sharing system that allows users to upload files and share them via unique codes or links.

## Features

- **Easy File Upload**: Drag-and-drop or file picker interface
- **Secure Sharing**: Generate unique 6-digit codes for file access
- **Password Protection**: Optional password protection for shared files
- **Time-Limited Shares**: Set expiration times (1 hour to 7 days)
- **Download Limits**: Control maximum number of downloads
- **File Previews**: Preview code files with syntax highlighting
- **Cross-Platform**: Works on web, mobile, and desktop browsers

## Deployment on Vercel

This project is optimized for deployment on Vercel. Follow these steps:

### 1. Prepare Your Project

Make sure all files are committed to your Git repository.

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Vite project
5. Click "Deploy"

### 3. Configuration

The project includes a `vercel.json` file that:
- Handles client-side routing (SPA)
- Sets security headers
- Optimizes for static file serving

### 4. Environment Variables (Optional)

If you want to use Supabase for persistent storage:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 5. Custom Domain (Optional)

1. Go to Settings > Domains in your Vercel dashboard
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How It Works

### Storage System

The app uses a hybrid storage approach:
- **Local Development**: Uses localStorage for immediate testing
- **Production**: Uses in-memory storage (resets on server restart)
- **Optional**: Can be configured to use Supabase for persistent storage

### File Handling

1. Files are converted to base64 for storage
2. Share codes are generated using secure random characters
3. Files are bundled with metadata in a single share record
4. Downloads are tracked and limited based on settings

### Security Features

- Password hashing using SHA-256
- Time-based expiration
- Download count limits
- Secure code generation
- XSS and CSRF protection headers

## Limitations

- **File Size**: Limited by browser memory (recommended max 50MB per file)
- **Storage**: In-memory storage resets on server restart
- **Concurrent Users**: Limited by server memory

## Upgrading to Persistent Storage

For production use with persistent storage, consider:
1. Setting up Supabase (recommended)
2. Using a proper database (PostgreSQL, MongoDB)
3. Implementing file storage (AWS S3, Cloudinary)
4. Adding user authentication

## Support

For issues or questions, please check the documentation or create an issue in the repository.