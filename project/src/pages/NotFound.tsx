import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileX } from 'lucide-react';
import Header from '../components/Header';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <FileX className="w-12 h-12 text-gray-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or the share code may have expired.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </button>
            
            <div className="block">
              <button
                onClick={() => navigate('/receive')}
                className="text-blue-600 hover:text-blue-700"
              >
                Try entering a different code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;