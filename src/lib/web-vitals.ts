/**
 * Web Vitals Performance Monitoring
 * 
 * This script monitors Core Web Vitals and sends them to your analytics.
 * Uncomment and configure according to your analytics provider.
 */

// Uncomment to enable web vitals reporting
/*
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Replace with your analytics endpoint
  const body = JSON.stringify(metric);
  
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

// Monitor Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
*/

// Simple console logging for development
if (import.meta.env.DEV) {
  console.log('🚀 Development mode - Performance monitoring disabled');
}

export {};
