import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeNews from './pages/HomeNews.jsx';
import CopaApp from './pages/CopaApp.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeNews />} />
          <Route path="/copa/*" element={<CopaApp />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;