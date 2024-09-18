// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle Socket.io connections
socketHandler(io);

// Catch-all handler for any requests not handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
