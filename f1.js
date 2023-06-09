const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)


// Magic Lines
server.prependListener("request", (req, res) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
});
// instead of "*" your can also add the other domain/servername
server.listen(process.env.PORT||4000, () => {
   console.log("This is the socket server running");
});

const {instrument} = require('@socket.io/admin-ui')
const cors = require('cors')


app.use(cors())




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



