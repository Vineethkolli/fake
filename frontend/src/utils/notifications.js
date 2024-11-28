import axios from 'axios';
import io from 'socket.io-client';
import { API_URL } from './config';

// Initialize Socket.IO client
const socket = io(API_URL);

// Subscribe to real-time notifications via WebSockets
export async function subscribeToRealTimeNotifications(userId) {
  if (!userId) return;

  socket.emit('join', userId); // Join the user's notification room

  socket.on('notification', (data) => {
    const { title, body } = data;

    // Show notification if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
  });
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  try {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    // Fetch the public VAPID key from the server
    const response = await axios.get(`${API_URL}/api/notifications/vapidPublicKey`);
    const { publicKey } = response.data;

    const registration = await navigator.serviceWorker.ready;

    // Unsubscribe from existing push subscriptions
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });

    // Send subscription details to the server
    await axios.post(`${API_URL}/api/notifications/subscribe`, subscription, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications() {
  try {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }

    await axios.post(`${API_URL}/api/notifications/unsubscribe`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    throw error;
  }
}

// Show a local notification
export function showNotification(title, body, data = {}) {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    const options = {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
      vibrate: [200, 100, 200],
      data,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Open',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }
}
