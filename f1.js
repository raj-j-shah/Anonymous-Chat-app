const express = require('express');
const {instrument} = require('@socket.io/admin-ui')
const app = express();
const {Server} = require('socket.io');
const http = require('http');

const io = new Server({
    cors: {
      origin: '*'
    }
  });
  
 
  

const port = process.env.PORT || 3003;
io.listen(port);

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('groom',(prevr,value,cb) => {
      socket.leave(prevr);
      console.log('client left ' );
      socket.join(value);
      console.log('client joined '+value);
      cb();
    })
   socket.on('msg',(value,rvalue) => {
    if(rvalue==="")
    socket.broadcast.emit('msg',value);
    else
    socket.to(rvalue).emit('msg',value);
    console.log(value,socket.id);
   })
});

instrument(io,{auth:false})



