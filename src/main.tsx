import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import { App } from './v2/App.tsx'
import { registerSW } from 'virtual:pwa-register'
import Lenis from 'lenis'

// Initialize smooth scrolling
const lenis = new Lenis({
  autoRaf: true,
  smoothWheel: true,
  syncTouch: true,
  lerp: 0.1,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
