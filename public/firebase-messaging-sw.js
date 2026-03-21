importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA5PLY8nRlhnbr6b6MoisJH-tiRxv42pxE",
  authDomain: "climax-app-88886.firebaseapp.com",
  projectId: "climax-app-88886",
  storageBucket: "climax-app-88886.firebasestorage.app",
  messagingSenderId: "1002004311732",
  appId: "1:1002004311732:web:ef963e5af08cad608a71e1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "ClimaX — Alerta Climático";
  const body =
    payload.notification?.body ?? "Uma condição climática foi detectada!";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.png",
    badge: "/favicon.png",
    tag: "climax-alert",
    data: payload.data,
  });
});
