const express = require('express');
const {instrument} = require('@socket.io/admin-ui')
const cors = require('cors')
const app = express();
const {Server} = require('socket.io');
const http = require('http');
app.use(cors())
var server = app.listen(process.env.PORT||4000);

var io = require('socket.io')(server, {
    cors: {
      origin: '*'
    }
});
  console.log("started!");



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



