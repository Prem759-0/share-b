import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { File, Image, Video, Code, X } from 'lucide-react';
import { Button } from './ui/Button';
import { isCodeFile, isImageFile, isVideoFile } from '../lib/fileUtils';

interface FilePreviewProps {
  file: File;
  onClose: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFileContent = async () => {
      if (isCodeFile(file.name)) {
        try {
          const text = await file.text();
          setContent(text);
        } catch (error) {
          console.error('Error reading file:', error);
          setContent('Error loading file content');
        }
      }
      setLoading(false);
    };

    loadFileContent();
  }, [file]);

  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'jsx',
      tsx: 'tsx',
      py: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      cpp: 'cpp',
      java: 'java',
      php: 'php'
    };
    return languageMap[extension || ''] || 'text';
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (isCodeFile(file.name)) {
      return (
        <div className="max-h-96 overflow-auto">
          <SyntaxHighlighter
            language={getLanguage(file.name)}
            style={tomorrow}
            showLineNumbers
            className="rounded-lg"
          >
            {content}
          </SyntaxHighlighter>
        </div>
      );
    }

    if (isImageFile(file.name)) {
      const imageUrl = URL.createObjectURL(file);
      return (
        <div className="text-center">
          <img
            src={imageUrl}
            alt={file.name}
            className="max-w-full max-h-96 rounded-lg shadow-lg mx-auto"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        </div>
      );
    }

    if (isVideoFile(file.name)) {
      const videoUrl = URL.createObjectURL(file);
      return (
        <div className="text-center">
          <video
            src={videoUrl}
            controls
            className="max-w-full max-h-96 rounded-lg shadow-lg mx-auto"
            onLoadedData={() => URL.revokeObjectURL(videoUrl)}
          />
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Preview not available for this file type</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            {isCodeFile(file.name) && <Code className="w-5 h-5 text-blue-600" />}
            {isImageFile(file.name) && <Image className="w-5 h-5 text-green-600" />}
            {isVideoFile(file.name) && <Video className="w-5 h-5 text-purple-600" />}
            {!isCodeFile(file.name) && !isImageFile(file.name) && !isVideoFile(file.name) && (
              <File className="w-5 h-5 text-gray-600" />
            )}
            <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={X}
          >
            Close
          </Button>
        </div>
        
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};