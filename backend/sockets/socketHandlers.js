const { emailToSocketIdMap, socketidToEmailMap, socketidToStream,users,socketToRoom } = require('./socketMapping');

const handleSocketConnection = (io) => {

  io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);

    // Handle joining a room
    socket.on("join room", (roomID) => {
        console.log(`User ${socket.id} joining room: ${roomID}`);
        
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                console.log("Room is full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }

        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
        
        // Send the list of existing users in the room
        socket.emit("all users", usersInThisRoom);
    });
    // Handle sending a signal
    socket.on("sending signal", (payload) => {
        console.log(`Sending signal from ${payload.callerID} to ${payload.userToSignal}`);
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });
  
    // Handle returning a signal
    socket.on("returning signal", (payload) => {
        console.log(`Returning signal to ${payload.callerID} from ${socket.id}`);
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });
  
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        const roomId = socketToRoom[socket.id];
        let room = users[roomId];
        if (room) {
            room = room.filter((id) => id !== socket.id);
            users[roomId] = room;
        }
    });
  });
  
};

module.exports = { handleSocketConnection };


//other code




//prevous code
// io.on('connection', (socket) => {
//   console.log(`Socket Connected`, socket.id);

//   socket.on('room:join', (data) => {
//     console.log('room:join');
//     const { email, room } = data;
//     socket.roomId = room;
//     emailToSocketIdMap.set(email, socket.id);
//     socketidToEmailMap.set(socket.id, email);
//     io.to(room).emit('user:joined', { email, id: socket.id });
//     socket.join(room);
//     io.to(socket.id).emit('room:join', data);
//   });

//   socket.on('user:call', ({ to, offer }) => {
//     console.log('usecall');
//     io.to(to).emit('incomming:call', { from: socket.id, offer });
//   });

//   socket.on('message', ({ room, message }) => {
//     console.log(room, message);
//     io.to(room).emit('receive-message', { message, id: socket.id, name: socketidToEmailMap.get(socket.id) });
//   });

//   socket.on('call:accepted', ({ to, ans }) => {
//     console.log('callaccepted');
//     io.to(to).emit('call:accepted', { from: socket.id, ans });
//   });

//   socket.on('peer:nego:needed', ({ to, offer }) => {
//     console.log('peer:negoneeded');
//     io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
//   });

//   socket.on('update-streams', ({ socketId, stream }) => {
//     console.log(socketId, ":", stream);
//     socketidToStream.push({ socketId, stream });
//   });

//   socket.on('peer:nego:done', ({ to, ans }) => {
//     console.log('peer:done]');
//     io.to(to).emit('peer:nego:final', { from: socket.id, ans });
//   });

//   socket.on("leave-room", () => {
//     const roomId = socket.roomId;
//     console.log(`User ${socket.id} is leaving the room`);
//     socket.broadcast.to(roomId).emit("user-left", { userId: socket.id });
//     socket.leave(roomId);
//   });

//   socket.on('disconnect', () => {
//     console.log(`Socket Disconnected: ${socket.id}`);
//     const email = socketidToEmailMap.get(socket.id);
//     if (email) {
//       emailToSocketIdMap.delete(email);
//       socketidToEmailMap.delete(socket.id);
//     }
//   });
// });i