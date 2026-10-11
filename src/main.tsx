import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Universal storage sanitization: purge any stale legacy cached records from previous tests
try {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key);
      const isLegacyKey = key.toLowerCase().includes('vigneshwaran') || key.toLowerCase().includes('vicky');
      const isLegacyVal = val && (val.toLowerCase().includes('vigneshwaran') || val.toLowerCase().includes('vicky'));
      if (isLegacyKey || isLegacyVal) {
        localStorage.removeItem(key);
      }
    }
  }
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
