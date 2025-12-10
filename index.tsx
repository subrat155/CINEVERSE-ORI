import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// FIX: Force reset to Home Page on every refresh/reload
if (window.location.hash !== '#/') {
  window.location.hash = '#/';
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);