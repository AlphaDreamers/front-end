importScripts("https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
  appId: "<YOUR_APP_ID>",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  const options = {
    body,
    icon: "/icons/notification-icon.png", // adjust path as needed
  };
  self.registration.showNotification(title, options);
});
