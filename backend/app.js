require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes.js');
const reqRoutes = require('./routes/reqRoutes.js');
const db = require('./connection/connection.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/req', reqRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const emailToSocketIdMap = new Map()
const socketidToEmailMap = new Map()

io.on('connection', socket => {
  console.log(`Socket Connected`, socket.id)
  socket.on('room:join', data => {
    console.log('room:join')
    const { email, room } = data
    emailToSocketIdMap.set(email, socket.id)
    socketidToEmailMap.set(socket.id, email)
    io.to(room).emit('user:joined', { email, id: socket.id })
    socket.join(room)
    io.to(socket.id).emit('room:join', data)
  })

  socket.on('user:call', ({ to, offer }) => {
    console.log('usecall')
    io.to(to).emit('incomming:call', { from: socket.id, offer })
  })

  socket.on('call:accepted', ({ to, ans }) => {
    console.log('callaccepted')
    io.to(to).emit('call:accepted', { from: socket.id, ans })
  })

  socket.on('peer:nego:needed', ({ to, offer }) => {
    console.log('peer:negoneeded]')

    console.log('peer:nego:needed', offer)
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
  })

  socket.on('peer:nego:done', ({ to, ans }) => {
    console.log('peer:done]')
    console.log('peer:nego:done', ans)
    io.to(to).emit('peer:nego:final', { from: socket.id, ans })
  })

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
    const email = socketidToEmailMap.get(socket.id);
    if (email) {
      emailToSocketIdMap.delete(email);
      socketidToEmailMap.delete(socket.id);
    }
  });
})

app.get('/',(req,res)=>{
  console.log('getparticipnat')
  res.status(200).json({
    participants: Array.from(emailToSocketIdMap.keys())
  });
})

server.listen(port,()=>{
  console.log(`server is listeneing on port:${port}`)
})