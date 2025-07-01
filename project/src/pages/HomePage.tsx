import React, { useState, useCallback } from 'react';
import { Upload, Share2, Download, Shield, Zap, Globe } from 'lucide-react';
import Header from '../components/Header';
import FileUploader from '../components/FileUploader';
import ShareModal from '../components/ShareModal';
import FeatureCard from '../components/FeatureCard';
import { FileData } from '../types';

const HomePage: React.FC = () => {
  const [shareData, setShareData] = useState<FileData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleUploadSuccess = useCallback((data: FileData) => {
    setShareData(data);
    setShowShareModal(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
    setShareData(null);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Files
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Instantly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload, share, and access files securely with AI-powered features. 
              Generate unique codes, set expiration times, and share with confidence.
            </p>
          </div>

          {/* File Uploader */}
          <div className="max-w-4xl mx-auto mb-20">
            <FileUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={Upload}
              title="Easy Upload"
              description="Drag and drop files up to 2GB with support for all file types"
            />
            <FeatureCard
              icon={Share2}
              title="Secure Sharing"
              description="Generate unique 6-digit codes with optional password protection"
            />
            <FeatureCard
              icon={Download}
              title="Fast Access"
              description="Recipients can download or preview files instantly with the code"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="End-to-End Security"
              description="Files are encrypted and automatically deleted after expiration"
            />
            <FeatureCard
              icon={Zap}
              title="AI-Powered"
              description="Smart file handling with natural language processing support"
            />
            <FeatureCard
              icon={Globe}
              title="Global CDN"
              description="Fast worldwide access with Vercel's edge network"
            />
          </div>
        </div>
      </section>

      {/* Share Modal */}
      {showShareModal && shareData && (
        <ShareModal
          data={shareData}
          onClose={handleCloseShareModal}
        />
      )}
    </div>
  );
};

export default HomePage;