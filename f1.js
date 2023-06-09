const express = require('express')
const app = express()
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
const cors = require('cors')
const server = require('http').createServer(app);
const io = require('socket.io')(server)
app.use(cors());

// Magic Lines
server.prependListener("request", (req, res) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
});
// instead of "*" your can also add the other domain/servername
server.listen(process.env.PORT||4000, () => {
   console.log("This is the socket server running");
});

const {instrument} = require('@socket.io/admin-ui')





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



