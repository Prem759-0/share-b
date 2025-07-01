import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Eye, FileText, Calendar, Shield, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FileMetadata } from '../types';
import { formatFileSize, formatDate } from '../utils/helpers';

const SharePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!code) {
        setError('Invalid share code');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/files/${code}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 && data.requiresPassword) {
            setShowPasswordInput(true);
            setFileData(data.metadata);
          } else {
            setError(data.error || 'File not found');
          }
        } else {
          setFileData(data);
        }
      } catch (err) {
        setError('Failed to load file information');
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [code]);

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch(`/api/files/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setFileData(data);
        setShowPasswordInput(false);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to verify password');
    }
  };

  const handleDownload = async () => {
    if (!code || !fileData) return;

    setDownloading(true);
    try {
      const response = await fetch(`/api/download/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: showPasswordInput ? password : undefined }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileData.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        setError(data.error || 'Download failed');
      }
    } catch (err) {
      setError('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">File Not Found</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : showPasswordInput && !fileData ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Protected</h2>
              <p className="text-gray-600 mb-6">This file requires a password to access</p>
              
              <div className="max-w-sm mx-auto">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
                <button
                  onClick={handlePasswordSubmit}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Access File
                </button>
              </div>
            </div>
          ) : fileData ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{fileData.originalName}</h1>
                  <p className="text-gray-500">Shared via BoltAI</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">File Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(fileData.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{fileData.mimeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>{formatDate(fileData.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Access Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Share Code:</span>
                      <span className="font-mono font-semibold">{code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{formatDate(fileData.expiresAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protected:</span>
                      <span>{fileData.hasPassword ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Downloading...' : 'Download File'}
                </button>
                
                {fileData.mimeType.startsWith('text/') && (
                  <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </button>
                )}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">
                    This file will be automatically deleted on {formatDate(fileData.expiresAt)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SharePage;