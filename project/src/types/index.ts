export interface FileShare {
  id: string;
  code: string;
  files: SharedFile[];
  password?: string;
  expiresAt: string;
  createdAt: string;
  downloadCount: number;
  maxDownloads?: number;
  isActive: boolean;
}

export interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  preview?: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}