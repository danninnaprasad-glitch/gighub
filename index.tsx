
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Global Error Handling
window.addEventListener('error', (e) => {
  console.error("Global Error Caught:", e);
  document.body.innerHTML = `
    <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
      <h1 style="color:#2563eb; font-size:3rem; margin-bottom:10px;">Whoops!</h1>
      <p style="color:#4b5563; font-size:1.2rem;">Something went wrong while loading GigHub.</p>
      <button onclick="window.location.reload()" style="margin-top:20px; padding:12px 24px; background:#2563eb; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Try Reloading</button>
    </div>
  `;
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
