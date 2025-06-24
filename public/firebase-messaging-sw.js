// Import Firebase libraries
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase
// firebase.initializeApp({
//   apiKey: "AIzaSyD8sUlIFoYv-FNcnGtMbxVaJwAiZ0mSVF0",
//   authDomain: "rantonme-beta.firebaseapp.com",
//   projectId: "rantonme-beta",
//   storageBucket: "rantonme-beta.appspot.com",
//   messagingSenderId: "678995798792",
//   appId: "1:678995798792:web:3f06bcfc135b2787469abd",
//   measurementId: "G-KLG7RJF9E9"
// });
firebase.initializeApp({
  apiKey: "AIzaSyDMadvCE1N_nU30RTdx_kfl_3EPTX15X08",
  authDomain: "rant-on-me-4d88b.firebaseapp.com",
  projectId: "rant-on-me-4d88b",
  storageBucket: "rant-on-me-4d88b.firebasestorage.app",
  messagingSenderId: "382485827600",
  appId: "1:382485827600:web:609335987efb3cbe06fa95",
  measurementId: "G-4RW1BS9DE3"
});

// Get messaging instance
const messaging = firebase.messaging();

// Handle background FCM messages
messaging.onBackgroundMessage(payload => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const { title, body, icon, badge } = payload.notification || {
    title: "Rant On Me",
    body: "You have a new notification.",
    icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/726/726496.png'
  };

  const notificationOptions = {
    body,
    icon,
    badge,
    vibrate: [200, 100, 200],
    tag: 'rant-on-me',
    renotify: true
  };

  self.registration.showNotification(title, notificationOptions);
});

// Optional: Handle generic push events
self.addEventListener('push', event => {
  const payload = event.data?.json() || {};
  const { title, body, icon, badge } = payload.notification || {
    title: "Rant On Me",
    body: "You have a new rant!",
    icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/726/726496.png',
  };

  const options = {
    body,
    icon,
    badge,
    vibrate: [200, 100, 200],
    tag: 'rant-on-me',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Optional: Caching for offline support (PWA)
const CACHE_NAME = "rantonme-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
