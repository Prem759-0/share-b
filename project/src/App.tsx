import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Upload } from './pages/Upload';
import { Download } from './pages/Download';
import { ReceiveCode } from './pages/ReceiveCode';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/receive" element={<ReceiveCode />} />
          <Route path="/download/:code" element={<Download />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;