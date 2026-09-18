import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

document.body.style.backgroundColor = '#0f172a';
document.body.style.margin = '0';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
