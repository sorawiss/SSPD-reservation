const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const bookingsRouter = require('./routes/bookings');
const statsRouter = require('./routes/stats');

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://192.168.1.249:8080", "http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${FRONTEND_PORT}`;

// Middleware
app.use(cors({
  origin: ["http://192.168.1.249:8080", "http://localhost:3000", "http://localhost:8080", FRONTEND_URL],  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"]
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SSPD Booking System Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    googleSheets: {
      type: process.env.GOOGLE_TYPE ? 'SET' : 'NOT SET',
      projectId: process.env.GOOGLE_PROJECT_ID ? 'SET' : 'NOT SET',
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL ? 'SET' : 'NOT SET'
    }
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_date', (date) => {
    socket.join(`date_${date}`);
    console.log(`Client ${socket.id} joined date room: ${date}`);
  });
  
  socket.on('leave_date', (date) => {
    socket.leave(`date_${date}`);
    console.log(`Client ${socket.id} left date room: ${date}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`🚀 SSPD Booking System Backend running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for real-time updates`);
}); 