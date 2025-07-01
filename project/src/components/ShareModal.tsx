import React, { useState } from 'react';
import { X, Copy, Check, Share2, Clock, Shield } from 'lucide-react';
import { FileData } from '../types';

interface ShareModalProps {
  data: FileData;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share/${data.code}`;

  const copyToClipboard = async (text: string, type: 'url' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'url') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">File Shared Successfully!</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              Your file has been uploaded and is ready to share
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Code
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-2xl font-mono font-bold text-center py-3 bg-white rounded-lg border">
                {data.code}
              </code>
              <button
                onClick={() => copyToClipboard(data.code, 'code')}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {codeCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => copyToClipboard(shareUrl, 'url')}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center text-blue-600 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-medium">Expires</span>
              </div>
              <p className="text-blue-700">{data.expiresAt}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center text-green-600 mb-1">
                <Shield className="w-4 h-4 mr-1" />
                <span className="font-medium">Security</span>
              </div>
              <p className="text-green-700">Encrypted</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Recipients can use either the code or link to access your file
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;