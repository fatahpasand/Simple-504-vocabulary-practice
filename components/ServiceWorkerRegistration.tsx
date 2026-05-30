'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register the service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[v0] Service Worker registered with scope:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, refresh to get it
                  console.log('[v0] New content available, refreshing...')
                  newWorker.postMessage({ type: 'SKIP_WAITING' })
                  window.location.reload()
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('[v0] Service Worker registration failed:', error)
        })

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[v0] Service Worker controller changed')
      })
    }
  }, [])

  return null
}
