import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download as DownloadIcon, Lock, Eye, File, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FilePreview } from '../components/FilePreview';
import { formatFileSize, getFileIcon } from '../lib/fileUtils';
import { hashPassword } from '../lib/encryption';

export const Download: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [share, setShare] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      fetchShare(code.toUpperCase());
    }
  }, [code]);

  const fetchShare = async (shareCode: string) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Looking for share with code:', shareCode);
      
      // Get shares from localStorage
      const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
      console.log('All shares in localStorage:', existingShares);
      
      const shareData = existingShares.find((s: any) => s.code === shareCode);
      console.log('Found share:', shareData);
      
      if (!shareData) {
        setError('Share not found. Please check the code and try again.');
        return;
      }

      // Check if expired
      if (new Date(shareData.expiresAt) < new Date()) {
        setError('This share has expired');
        return;
      }

      // Check download limit
      if (shareData.maxDownloads && shareData.downloadCount >= shareData.maxDownloads) {
        setError('This share has reached its download limit');
        return;
      }

      setShare(shareData);
      
      // Show password form if password protected
      if (shareData.password) {
        setShowPasswordForm(true);
      }
    } catch (err) {
      console.error('Error fetching share:', err);
      setError('Share not found or has expired. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPassword = async () => {
    if (!share || !password) return;

    const hashedPassword = hashPassword(password);
    if (hashedPassword === share.password) {
      setShowPasswordForm(false);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    if (!share) return;

    setDownloading(fileId);
    try {
      // Find the file
      const file = share.files?.find((f: any) => f.id === fileId);
      if (!file) {
        throw new Error('File not found');
      }

      // Download the base64 data
      const link = document.createElement('a');
      link.href = file.data;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count in localStorage
      const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
      const updatedShares = existingShares.map((s: any) => 
        s.code === share.code ? { ...s, downloadCount: s.downloadCount + 1 } : s
      );
      localStorage.setItem('file_shares', JSON.stringify(updatedShares));

      // Update local state
      setShare((prev: any) => prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null);
      setDownloading(null);
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed. Please try again.');
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    if (!share || !share.files) return;
    
    // Download each file individually
    for (const file of share.files) {
      await downloadFile(file.id, file.name);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between downloads
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading share...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Share Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/'} variant="primary">
              Upload New Files
            </Button>
            <Button onClick={() => window.location.href = '/receive'} variant="outline">
              Try Another Code
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Password Required</h2>
            <p className="text-gray-600">This share is protected by a password</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
              required
            />
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <Button
              onClick={verifyPassword}
              disabled={!password}
              className="w-full"
            >
              Access Files
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!share) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-4">
            <DownloadIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Download Files</h1>
          <p className="text-gray-600">Code: <span className="font-mono font-bold">{share.code}</span></p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Files ({share.files?.length || 0})
              </h3>
              {share.files && share.files.length > 1 && (
                <Button onClick={downloadAll} variant="secondary">
                  Download All
                </Button>
              )}
            </div>

            {share.files && share.files.length > 0 ? (
              <div className="space-y-3">
                {share.files.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => downloadFile(file.id, file.name)}
                        disabled={downloading === file.id}
                        variant="primary"
                        size="sm"
                      >
                        {downloading === file.id ? 'Downloading...' : 'Download'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No files available</p>
              </div>
            )}

            {/* Share Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Downloads:</span>
                  <span className="ml-2 font-medium">
                    {share.downloadCount} / {share.maxDownloads || '∞'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Expires:</span>
                  <span className="ml-2 font-medium">
                    {new Date(share.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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