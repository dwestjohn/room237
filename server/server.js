const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const recipeRoutes = require('./routes/recipe');
app.use('/api/recipes', recipeRoutes);
const orderRoutes = require('./routes/order'); 
app.use('/api/order', orderRoutes);
const drinkOrderRoutes = require('./routes/drinkOrders');
app.use('/api/drink-orders', drinkOrderRoutes);
const inventoryRoutes = require('./routes/inventory');
app.use('/api/inventory', inventoryRoutes);

// Create HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ restrict later to your frontend URL
  },
});

// --- Keno 237 Game State ---
let players = [];
let gameMaster = null;

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Player joins or reconnects
  socket.on('join', ({ playerId, name }, callback) => {
    let existing = players.find((p) => p.playerId === playerId);

    if (existing) {
      // Reconnect existing player
      existing.id = socket.id;
      existing.disconnected = false;
      io.emit('playersUpdate', players);
      if (callback) callback(existing);
      return;
    }

    // New player
    const isFirst = players.length === 0;
    const newPlayer = {
      id: socket.id,
      playerId,
      name,
      isGM: isFirst,
      number: null,
      ready: false,
      disconnected: false,
    };

    players.push(newPlayer);
    if (isFirst) gameMaster = socket.id;

    io.emit('playersUpdate', players);
    if (callback) callback(newPlayer);
  });

  // Player picks a number
  socket.on('pickNumber', (num, callback) => {
    if (players.some((p) => p.number === num)) return;
    players = players.map((p) =>
      p.id === socket.id ? { ...p, number: num } : p
    );
    const updated = players.find((p) => p.id === socket.id);
    io.emit('playersUpdate', players);
    if (callback) callback(updated);
  });

  // Player marks ready
  socket.on('ready', (callback) => {
    players = players.map((p) =>
      p.id === socket.id ? { ...p, ready: true } : p
    );
    const updated = players.find((p) => p.id === socket.id);
    io.emit('playersUpdate', players);
    if (callback) callback(updated);
  });

  // GM starts round
  socket.on('startRound', () => {
    if (socket.id !== gameMaster) return;

    io.emit('roundLocked');

    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const drawn = [];
    while (drawn.length < 20) {
      const idx = Math.floor(Math.random() * pool.length);
      drawn.push(pool.splice(idx, 1)[0]);
    }

    const winners = players.filter((p) => drawn.includes(p.number));
    let outcome;
    if (winners.length === 1) {
      outcome = { type: 'winner', player: winners[0].name };
    } else if (winners.length > 1) {
      outcome = { type: 'draw', count: winners.length };
    } else {
      outcome = { type: 'none' };
    }

    io.emit('roundStart', { drawn });

    setTimeout(() => {
      io.emit('roundOutcome', outcome);
    }, drawn.length * 5000);
  });

  // GM clears board
  socket.on('clearBoard', () => {
    if (socket.id !== gameMaster) return;
    players = players.map((p) => ({
      ...p,
      number: null,
      ready: false,
    }));
    io.emit('playersUpdate', players);
    io.emit('boardCleared');
  });

  // Mark player disconnected instead of removing
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    let player = players.find((p) => p.id === socket.id);
    if (player) {
      player.disconnected = true;
      io.emit('playersUpdate', players);
    }
  });

  // End Game (hard reset)
  socket.on('endGame', () => {
    players = [];
    gameMaster = null;
    io.emit('playersUpdate', players);
    io.emit('gameEnded');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




