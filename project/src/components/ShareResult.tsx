import React, { useState } from 'react';
import { Copy, Share2, Check, QrCode, Link } from 'lucide-react';
import { Button } from './ui/Button';

interface ShareResultProps {
  code: string;
  shareUrl: string;
  expiresAt: string;
}

export const ShareResult: React.FC<ShareResultProps> = ({
  code,
  shareUrl,
  expiresAt
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const copyToClipboard = async (text: string, type: 'code' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'File Share',
          text: `Use code: ${code}`,
          url: shareUrl
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const formatExpiryTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Files Uploaded Successfully!
          </h3>
          <p className="text-gray-600">
            Share your files using the code or link below
          </p>
        </div>

        {/* Share Code */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Share Code
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <span className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
                {code}
              </span>
            </div>
            <Button
              onClick={() => copyToClipboard(code, 'code')}
              variant="outline"
              icon={copiedCode ? Check : Copy}
              className={copiedCode ? 'text-green-600' : ''}
            >
              {copiedCode ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Share URL */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Share Link
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-white rounded-lg border text-left">
              <span className="text-sm text-gray-600 break-all">
                {shareUrl}
              </span>
            </div>
            <Button
              onClick={() => copyToClipboard(shareUrl, 'url')}
              variant="outline"
              icon={copiedUrl ? Check : Link}
              className={copiedUrl ? 'text-green-600' : ''}
            >
              {copiedUrl ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {navigator.share && (
            <Button
              onClick={shareNative}
              variant="secondary"
              icon={Share2}
            >
              Share
            </Button>
          )}
        </div>

        {/* Expiry Info */}
        <div className="text-sm text-gray-500 bg-white p-3 rounded-lg">
          <p>
            <strong>Expires:</strong> {formatExpiryTime(expiresAt)}
          </p>
        </div>
      </div>
    </div>
  );
};