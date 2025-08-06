import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/room.js';
import http from "http";
import { registerSocketHandlers } from "./sockets/socketManager.js";
import { Server as SocketIOServer } from "socket.io";



// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:3000', // Adjust in production!
    methods: ["GET", "POST", "PATCH"],
  },
});




// ===== Middleware =====
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "🚀 Server is up and running" })
})




// Socket.io
// ===================
io.on("connection", (socket) => {
  console.log(`🔥 Socket connected: ${socket.id}`);
  registerSocketHandlers(io, socket);    // 💡 centralized controller
});






// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);


// ===== Health Check Route =====
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ===== 404 Handler =====
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ===== Start Server =====
server.listen(PORT, () => {
   console.log(`🚀 Server running with Socket.IO on http://localhost:${PORT}`);
 });