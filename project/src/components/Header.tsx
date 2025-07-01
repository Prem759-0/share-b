import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Upload, Download } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span>BoltAI</span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Upload
            </button>
            <button
              onClick={() => navigate('/receive')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Receive
            </button>
            <a
              href="https://x.ai/grok"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Upgrade
            </a>
          </nav>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/receive')}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;