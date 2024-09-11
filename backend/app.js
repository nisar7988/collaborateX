require('dotenv').config();
const { emailToSocketIdMap, socketidToEmailMap, socketidToStream,users,socketToRoom } = require('./sockets/socketMapping.js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./connection/connection.js');
const authRoutes = require('./routes/authRoutes.js');
const reqRoutes = require('./routes/reqRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const updateRoutes = require('./routes/updateRoutes.js');
console.log('emial is',process.env.EMAIL_USER)
const { handleSocketConnection } = require('./sockets/socketHandlers');
const cloudinary = require('cloudinary').v2;
const app = express();
const port = 3000;
//middelwares
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
//routes
app.use('/api/auth', authRoutes);
app.use('/api/req', reqRoutes);
app.use("/api/post", postRoutes);
app.use('/api/update', updateRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


cloudinary.config({
  cloud_name: 'dnumgiioa',
  api_key: '928152437373728',
  api_secret:'i6wS-1zxGCwTiNk0r6sBXvg3bp4',
});
// Initialize socket handlers

handleSocketConnection(io);
//send participants

app.get('/', (req, res) => {
  console.log('getparticipnat');
  res.status(200).json({
    participants: Array.from(emailToSocketIdMap.keys())
  });
});


//send streams
app.get('/get-stream', (req, res) => {
  console.log('fetchStream');
  res.status(200).json(socketidToStream);
});


//listening server
server.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});



