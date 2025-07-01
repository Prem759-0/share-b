import React, { useState } from 'react';
import { Clock, Lock, Download } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ShareOptionsProps {
  password: string;
  onPasswordChange: (password: string) => void;
  expirationHours: number;
  onExpirationChange: (hours: number) => void;
  maxDownloads: number;
  onMaxDownloadsChange: (downloads: number) => void;
  enablePassword: boolean;
  onEnablePasswordChange: (enabled: boolean) => void;
}

export const ShareOptions: React.FC<ShareOptionsProps> = ({
  password,
  onPasswordChange,
  expirationHours,
  onExpirationChange,
  maxDownloads,
  onMaxDownloadsChange,
  enablePassword,
  onEnablePasswordChange
}) => {
  const expirationOptions = [
    { value: 1, label: '1 hour' },
    { value: 6, label: '6 hours' },
    { value: 24, label: '24 hours' },
    { value: 72, label: '3 days' },
    { value: 168, label: '7 days' }
  ];

  const downloadOptions = [
    { value: 1, label: '1 download' },
    { value: 5, label: '5 downloads' },
    { value: 10, label: '10 downloads' },
    { value: 50, label: '50 downloads' },
    { value: 999, label: 'Unlimited' }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Lock className="w-5 h-5 mr-2" />
        Share Options
      </h3>

      {/* Password Protection */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enable-password"
            checked={enablePassword}
            onChange={(e) => onEnablePasswordChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="enable-password" className="font-medium text-gray-700">
            Password Protection
          </label>
        </div>
        
        {enablePassword && (
          <Input
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Enter password"
            className="mt-2"
          />
        )}
      </div>

      {/* Expiration Time */}
      <div className="space-y-3">
        <label className="flex items-center font-medium text-gray-700">
          <Clock className="w-4 h-4 mr-2" />
          Expires After
        </label>
        <div className="grid grid-cols-3 gap-2">
          {expirationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onExpirationChange(option.value)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                expirationHours === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Downloads */}
      <div className="space-y-3">
        <label className="flex items-center font-medium text-gray-700">
          <Download className="w-4 h-4 mr-2" />
          Max Downloads
        </label>
        <div className="grid grid-cols-3 gap-2">
          {downloadOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onMaxDownloadsChange(option.value)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                maxDownloads === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};