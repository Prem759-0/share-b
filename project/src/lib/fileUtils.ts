import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const iconMap: { [key: string]: string } = {
    // Code files
    'js': 'file-code',
    'ts': 'file-code',
    'py': 'file-code',
    'html': 'file-code',
    'css': 'file-code',
    'json': 'file-code',
    // Images
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'svg': 'image',
    // Videos
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    // Documents
    'pdf': 'file-text',
    'doc': 'file-text',
    'docx': 'file-text',
    'txt': 'file-text',
    // Archives
    'zip': 'archive',
    'rar': 'archive',
    '7z': 'archive',
  };
  
  return iconMap[extension || ''] || 'file';
};

export const isCodeFile = (fileName: string): boolean => {
  const codeExtensions = ['js', 'ts', 'py', 'html', 'css', 'json', 'jsx', 'tsx', 'cpp', 'java', 'php'];
  const extension = fileName.split('.').pop()?.toLowerCase();
  return codeExtensions.includes(extension || '');
};

export const isImageFile = (fileName: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
  const extension = fileName.split('.').pop()?.toLowerCase();
  return imageExtensions.includes(extension || '');
};

export const isVideoFile = (fileName: string): boolean => {
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const extension = fileName.split('.').pop()?.toLowerCase();
  return videoExtensions.includes(extension || '');
};

export const createZipFromFiles = async (files: File[]): Promise<Blob> => {
  const zip = new JSZip();
  
  for (const file of files) {
    zip.file(file.name, file);
  }
  
  return await zip.generateAsync({ type: 'blob' });
};

export const downloadZip = (blob: Blob, fileName: string) => {
  saveAs(blob, fileName);
};