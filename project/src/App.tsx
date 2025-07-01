import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import HomePage from './pages/HomePage';
import SharePage from './pages/SharePage';
import ReceivePage from './pages/ReceivePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/share/:code" element={<SharePage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;