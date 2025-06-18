require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const memeRoutes = require('./routes/memeRoutes');


// Initialize Supabase client
try {
  require('./services/supabaseClient');
} catch (error) {
  console.error('Failed to initialize Supabase:', error.message);
  process.exit(1);
}

const app = express();
const server = http.createServer(app); // for socket.io

const io = new Server(server, {
  cors: { origin: "*" },
  methods: ["GET", "POST"]
});
app.use(cors({ origin: "*", methods: "GET,POST" }));
app.use(express.json());

// Routes
app.use('/', memeRoutes);

// Handle socket connection
io.on('connection', (socket) => {
  console.log("🔌 User connected:", socket.id);
});

app.set("io", io); // so controllers can emit events

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

server.listen(5000, () => {
  console.log('🚀 Server is running on http://localhost:5000');
});
