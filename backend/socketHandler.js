// backend/socketHandler.js

const sanitizeHtml = require('sanitize-html');

module.exports = (io) => {
  const users = {};

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user joining
    socket.on('join', (username, callback) => {
      if (!username || users[username]) {
        return callback({ error: 'Username is taken or invalid' });
      }
      users[username] = socket.id;
      socket.username = username;
      io.emit('userList', Object.keys(users));
      callback({ success: true });
    });

    // Handle incoming messages
    socket.on('sendMessage', (message) => {
      const sanitizedMessage = sanitizeHtml(message.text);
      io.emit('message', {
        user: socket.username,
        text: sanitizedMessage,
        timestamp: new Date(),
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      delete users[socket.username];
      io.emit('userList', Object.keys(users));
      console.log('Client disconnected');
    });
  });
};
