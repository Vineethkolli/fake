import { io } from 'socket.io-client';
import { SOCKET_URL } from './config';

let socket;

export const initializeSocket = () => {
  socket = io(SOCKET_URL);

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('notification', (data) => {
    if (Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.body,
        icon: '/pwa-192x192.png'
      });
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const joinRoom = (userId) => {
  if (socket) {
    socket.emit('join', userId);
  }
};

export const leaveRoom = (userId) => {
  if (socket) {
    socket.emit('leave', userId);
  }
};