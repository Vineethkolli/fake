import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import webpush from 'web-push';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import paymentRoutes from './routes/payments.js';
import incomeRoutes from './routes/incomes.js';
import expenseRoutes from './routes/expenses.js';
import verificationRoutes from './routes/verification.js';
import statsRoutes from './routes/stats.js';
import developerRoutes from './routes/developer.js';
import { createDefaultDeveloper } from './utils/setupDefaults.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL
      : "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Generate VAPID keys for web push notifications
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:example@yourdomain.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available in routes
app.set('io', io);

// Routes
app.use('api/auth', authRoutes);
app.use('api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/developer', developerRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createDefaultDeveloper();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});