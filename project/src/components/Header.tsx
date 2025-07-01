import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Download, Share2 } from 'lucide-react';
import { Button } from './ui/Button';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ShareAnywhere</h1>
              <p className="text-xs text-gray-500">Secure file sharing made simple</p>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant={location.pathname === '/' ? 'primary' : 'ghost'}
              icon={Upload}
              size="sm"
            >
              Upload
            </Button>
            <Button
              onClick={() => navigate('/receive')}
              variant={location.pathname === '/receive' ? 'primary' : 'ghost'}
              icon={Download}
              size="sm"
            >
              Receive
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};