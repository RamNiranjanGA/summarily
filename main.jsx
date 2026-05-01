import React from 'react';
import { createRoot } from 'react-dom/client';
import SummarizerApp from './summarizer.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SummarizerApp />
  </React.StrictMode>
);
