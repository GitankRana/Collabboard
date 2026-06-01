import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e2e',
            color: '#e8e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#a6e3a1',
              secondary: '#1e1e2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f38ba8',
              secondary: '#1e1e2e',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);