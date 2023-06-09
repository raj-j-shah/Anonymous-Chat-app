const express = require('express');
const { instrument } = require('@socket.io/admin-ui');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors')
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const port = process.env.PORT || 4000;

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('groom', (prevr, value, cb) => {
    socket.leave(prevr);
    console.log('client left');
    socket.join(value);
    console.log('client joined ' + value);
    cb();
  });
  socket.on('msg', (value, rvalue) => {
    if (rvalue === '') socket.broadcast.emit('msg', value);
    else socket.to(rvalue).emit('msg', value);
    console.log(value, socket.id);
  });
});

instrument(io, { auth: false, mode: "development"});
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
