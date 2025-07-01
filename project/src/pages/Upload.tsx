import React, { useState } from 'react';
import { Upload as UploadIcon, Settings, Share2 } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { ShareOptions } from '../components/ShareOptions';
import { ShareResult } from '../components/ShareResult';
import { FilePreview } from '../components/FilePreview';
import { Button } from '../components/ui/Button';
import { generateShareCode, hashPassword } from '../lib/encryption';
import { storage } from '../lib/storage';
import { FileShare } from '../types';

interface UploadPageProps {}

export const Upload: React.FC<UploadPageProps> = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shareResult, setShareResult] = useState<FileShare | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  
  // Share options
  const [password, setPassword] = useState('');
  const [enablePassword, setEnablePassword] = useState(false);
  const [expirationHours, setExpirationHours] = useState(24);
  const [maxDownloads, setMaxDownloads] = useState(10);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const shareId = crypto.randomUUID();
      const shareCode = generateShareCode();
      const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000).toISOString();

      console.log('Generated share code:', shareCode);
      console.log('Files to upload:', files.length);

      // Convert files to base64 for storage
      const fileData = await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onload = () => {
              resolve({
                id: crypto.randomUUID(),
                name: file.name,
                size: file.size,
                type: file.type,
                data: reader.result
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      console.log('Files converted to base64');

      // Create share record
      const shareData = {
        id: shareId,
        code: shareCode,
        password: enablePassword ? hashPassword(password) : null,
        expiresAt,
        createdAt: new Date().toISOString(),
        downloadCount: 0,
        maxDownloads: maxDownloads === 999 ? null : maxDownloads,
        isActive: true,
        files: fileData
      };

      // Save using our storage system
      storage.saveShare(shareData);
      
      console.log('Saved share to storage:', shareData.code);
      console.log('Storage info:', storage.getStorageInfo());

      // Create result for display
      const shareResultData: FileShare = {
        ...shareData,
        files: fileData.map((f: any) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          url: f.data
        }))
      };

      setShareResult(shareResultData);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFiles([]);
    setShareResult(null);
    setShowOptions(false);
    setPassword('');
    setEnablePassword(false);
    setExpirationHours(24);
    setMaxDownloads(10);
  };

  if (shareResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <ShareResult
            code={shareResult.code}
            shareUrl={`${window.location.origin}/download/${shareResult.code}`}
            expiresAt={shareResult.expiresAt}
          />
          <div className="mt-6 text-center">
            <Button onClick={resetUpload} variant="outline">
              Upload More Files
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4">
            <UploadIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Share Files Anywhere</h1>
          <p className="text-gray-600">Upload your files and share them securely with anyone</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <FileUpload files={files} onFilesChange={setFiles} />
            
            {files.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setShowOptions(!showOptions)}
                    variant="outline"
                    icon={Settings}
                  >
                    {showOptions ? 'Hide Options' : 'Show Options'}
                  </Button>
                  
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    icon={Share2}
                    className="min-w-[140px]"
                  >
                    {uploading ? 'Uploading...' : 'Share Files'}
                  </Button>
                </div>

                {showOptions && (
                  <ShareOptions
                    password={password}
                    onPasswordChange={setPassword}
                    expirationHours={expirationHours}
                    onExpirationChange={setExpirationHours}
                    maxDownloads={maxDownloads}
                    onMaxDownloadsChange={setMaxDownloads}
                    enablePassword={enablePassword}
                    onEnablePasswordChange={setEnablePassword}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(storage.getStorageInfo(), null, 2)}
            </pre>
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <FilePreview
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}
      </div>
    </div>
  );
};