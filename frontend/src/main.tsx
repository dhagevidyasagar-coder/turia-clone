import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { API_BASE_URL } from './api'

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  const token = localStorage.getItem('token');
  
  // Normalize resource URL
  if (typeof resource === 'string' && (resource.includes('127.0.0.1:5005/api') || resource.includes('localhost:5005/api'))) {
    resource = resource.replace(/127\.0\.0\.1:5005\/api|localhost:5005\/api/, API_BASE_URL.replace('http://', ''));
  }

  if (token && typeof resource === 'string' && resource.includes('/api/')) {
    config = config || {};
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  const response = await originalFetch(resource, config);
  
  if (response.status === 401 && typeof resource === 'string' && !resource.includes('/auth/login')) {
    localStorage.removeItem('token');
    window.location.reload(); // Force re-render to trigger Auth Guard
  }
  
  return response;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
