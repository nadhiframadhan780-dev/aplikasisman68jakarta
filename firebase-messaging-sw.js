// Service Worker untuk Push Notification
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDAcKcg3alPOTH3FFGelYmsW7jcMMe2PLI",
    authDomain: "upnvjdatsystem.firebaseapp.com",
    projectId: "upnvjdatsystem",
    storageBucket: "upnvjdatsystem.firebasestorage.app",
    messagingSenderId: "57095309946",
    appId: "1:57095309946:web:b0e9f3f86380d549ffc9c3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('📩 Notifikasi background:', payload);
    
    const notificationTitle = payload.notification.title || 'SMAN 68 Jakarta';
    const notificationOptions = {
        body: payload.notification.body || 'Ada informasi baru!',
        icon: 'https://upload.wikimedia.org/wikipedia/id/1/19/Logo_SMAN_68_Jakarta.png',
        badge: 'https://upload.wikimedia.org/wikipedia/id/1/19/Logo_SMAN_68_Jakarta.png',
        vibrate: [200, 100, 200],
        data: payload.data || {},
        actions: [
            { action: 'open', title: 'Buka' },
            { action: 'close', title: 'Tutup' }
        ]
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/';
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url.includes(urlToOpen) && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
        );
    }
});
