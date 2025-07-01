export interface FileData {
  code: string;
  filename: string;
  url: string;
  expiresAt: string;
  hasPassword?: boolean;
}

export interface FileMetadata {
  id: string;
  code: string;
  originalName: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  expiresAt: string;
  hasPassword: boolean;
  downloadCount: number;
  maxDownloads?: number;
}

export interface UploadOptions {
  password?: string;
  expirationHours?: number;
  maxDownloads?: number;
}