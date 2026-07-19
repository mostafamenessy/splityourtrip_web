/* jshint esversion: 6 */
/* jshint esversion: 8 */

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

// Firebase configuration - Get these from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDW_c-B7ZStsW1qVpsa4RcAaf6NhAp0M3A",
  authDomain: "splityourtrip-e3467.firebaseapp.com",
  projectId: "splityourtrip-e3467",
  storageBucket: "splityourtrip-e3467.firebasestorage.app",
  messagingSenderId: "413951495406",
  appId: "1:413951495406:web:670a11a888374fb3c377ff",
  measurementId: "G-WGV3897Y44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only run Analytics on real deployed hosts - on localhost it pollutes GA with
// dev traffic and its background telemetry can throw uncatchable internal
// rejections in the dev environment.
const isLocalhost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
const analytics = isLocalhost ? null : getAnalytics(app);

// Initialize Firestore, Firebase Auth, and Realtime Database
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

const vapidKey = "*************************U6ejitDIQV_E3zDuCZ_SnyRNd8E";

// Firebase Messaging can only work with a real Web Push (VAPID) key and a
// supported, secure environment. The vapidKey above is still a placeholder
// (contains '*'), so messaging CANNOT function - and worse, calling
// getMessaging()/getToken() with invalid credentials triggers a promise
// rejection deep inside the bundled Firebase SDK that no .catch() in our code
// can reach (it surfaces as an uncaught "[object Object]" overlay in dev).
// So we only initialize messaging once a genuine vapidKey is configured.
// To enable push: replace vapidKey with the real key from Firebase Console ->
// Project Settings -> Cloud Messaging -> Web Push certificates.
const isVapidKeyConfigured = vapidKey && !vapidKey.includes('*');

let messaging = null;
if (isVapidKeyConfigured) {
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      } else {
        console.warn('Firebase Messaging is not supported in this environment.');
      }
    })
    .catch((err) => {
      console.warn('Firebase Messaging support check failed:', err);
    });
} else {
  console.warn('Firebase Messaging disabled: vapidKey is not configured.');
}

export const RecvestToken = async () => {
  if (!messaging) return null;
  return Notification.requestPermission()
    .then((permisson) => {
      if (permisson === "granted") {
        return getToken(messaging, { vapidKey });
      }
    })
    .catch((err) => {
      console.error("Failed to get FCM token:", err);
      return null;
    });
};

export { db, auth, database, messaging, analytics };
