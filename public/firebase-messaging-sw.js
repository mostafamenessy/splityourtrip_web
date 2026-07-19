importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDW_c-B7ZStsW1qVpsa4RcAaf6NhAp0M3A",
    authDomain: "splityourtrip-e3467.firebaseapp.com",
    projectId: "splityourtrip-e3467",
    storageBucket: "splityourtrip-e3467.firebasestorage.app",
    messagingSenderId: "413951495406",
    appId: "1:413951495406:web:670a11a888374fb3c377ff",
    measurementId: "G-WGV3897Y44"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
