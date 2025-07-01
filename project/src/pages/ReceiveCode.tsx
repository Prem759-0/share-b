import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const ReceiveCode: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCodeChange = (value: string) => {
    // Only allow alphanumeric characters and convert to uppercase
    const cleanCode = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleanCode.length <= 6) {
      setCode(cleanCode);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    
    if (trimmedCode.length !== 6) {
      setError('Please enter a valid 6-character code');
      return;
    }

    // Check if code exists in localStorage
    const existingShares = JSON.parse(localStorage.getItem('file_shares') || '[]');
    const shareExists = existingShares.find((s: any) => s.code === trimmedCode);
    
    if (!shareExists) {
      setError('Code not found. Please check and try again.');
      return;
    }

    // Check if share is still active and not expired
    if (!shareExists.isActive || new Date(shareExists.expiresAt) < new Date()) {
      setError('This code has expired or is no longer active.');
      return;
    }

    navigate(`/download/${trimmedCode}`);
  };

  // Get available codes for debugging
  const availableCodes = JSON.parse(localStorage.getItem('file_shares') || '[]')
    .filter((s: any) => s.isActive && new Date(s.expiresAt) > new Date())
    .map((s: any) => s.code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Receive Files</h1>
          <p className="text-gray-600">Enter the 6-digit code to access shared files</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Share Code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              className="text-center text-xl font-mono tracking-wider"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={code.length !== 6}
            className="w-full"
            icon={ArrowRight}
          >
            Access Files
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have a code?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Upload your own files
            </button>
          </p>
        </div>

        {/* Debug info for development - only show if there are codes */}
        {availableCodes.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center mb-1">
              Available codes for testing:
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {availableCodes.map((availableCode: string) => (
                <button
                  key={availableCode}
                  onClick={() => setCode(availableCode)}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono hover:bg-blue-200"
                >
                  {availableCode}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};