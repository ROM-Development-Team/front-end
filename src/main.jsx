// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';
import DeviceGate from './components/deviceGate.jsx';

// Register service worker for offline support
registerSW();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DeviceGate />
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registered:', registration);
    }).catch(error => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}
