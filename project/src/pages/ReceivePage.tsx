import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

const ReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const cleanCode = code.trim().toUpperCase();
    
    if (!cleanCode) {
      setError('Please enter a share code');
      return;
    }

    if (cleanCode.length !== 6) {
      setError('Share code must be 6 characters');
      return;
    }

    navigate(`/share/${cleanCode}`);
  };

  const handleInputChange = (value: string) => {
    setCode(value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Receive Files</h1>
            <p className="text-gray-600">
              Enter the 6-digit share code to access and download files
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Share Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => handleInputChange(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            
            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}
            
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Access File
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have a code? 
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 ml-1"
              >
                Upload and share files
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivePage;