/**
 * Express Server Setup for OTP Authentication API
 * 
 * This is a minimal Express server with OTP authentication endpoints.
 * Plain JavaScript version for Render deployment.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
const envResult = dotenv.config();

if (envResult.error) {
  console.warn('⚠️ .env file not found, using process env');
} else {
  console.log('✓ .env file loaded');
}

// Check if Supabase credentials exist
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERROR: Missing Supabase credentials!');
  console.error('   Please add to .env file:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  console.error('');
  console.error('   Get these from: https://app.supabase.com → Settings → API');
  process.exit(1);
}

// Now import routes (after env is loaded)
console.log('📍 Loading auth routes...');
import authRoutes from './api/auth.api.js';
console.log('✓ Auth routes loaded successfully');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://127.0.0.1:3000",
  ],
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Parse JSON requests (limit to 1mb to prevent abuse)
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 OTP Auth Server running on port', PORT);
  console.log('   Environment:', process.env.NODE_ENV || 'development');
  console.log('   API: http://localhost:' + PORT + '/api/auth');
  console.log('   Health check: http://localhost:' + PORT + '/health');
  console.log('');
  console.log('✓ Gmail:', process.env.GMAIL_USER ? '✓ Configured' : '✗ Missing');
  console.log('✓ Supabase:', SUPABASE_URL ? '✓ Configured' : '✗ Missing');
  console.log('');
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('\n🔥 UNCAUGHT EXCEPTION:');
  console.error('   Message:', error.message);
  console.error('   Stack:', error.stack);
  console.error('   Full error:', error);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n🔥 UNHANDLED REJECTION:');
  console.error('   Reason:', reason);
  console.error('   Promise:', promise);
  process.exit(1);
});

export default app;
