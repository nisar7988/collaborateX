const { emailToSocketIdMap, socketidToEmailMap, socketidToStream } = require('./socketMapping');

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket Connected`, socket.id);

    socket.on('room:join', (data) => {
      console.log('room:join');
      const { email, room } = data;
      socket.roomId = room;
      emailToSocketIdMap.set(email, socket.id);
      socketidToEmailMap.set(socket.id, email);
      io.to(room).emit('user:joined', { email, id: socket.id });
      socket.join(room);
      io.to(socket.id).emit('room:join', data);
    });

    socket.on('user:call', ({ to, offer }) => {
      console.log('usecall');
      io.to(to).emit('incomming:call', { from: socket.id, offer });
    });

    socket.on('message', ({ room, message }) => {
      console.log(room, message);
      io.to(room).emit('receive-message', { message, id: socket.id, name: socketidToEmailMap.get(socket.id) });
    });

    socket.on('call:accepted', ({ to, ans }) => {
      console.log('callaccepted');
      io.to(to).emit('call:accepted', { from: socket.id, ans });
    });

    socket.on('peer:nego:needed', ({ to, offer }) => {
      console.log('peer:negoneeded');
      io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
    });

    socket.on('update-streams', ({ socketId, stream }) => {
      console.log(socketId, ":", stream);
      socketidToStream.push({ socketId, stream });
    });

    socket.on('peer:nego:done', ({ to, ans }) => {
      console.log('peer:done]');
      io.to(to).emit('peer:nego:final', { from: socket.id, ans });
    });

    socket.on("leave-room", () => {
      const roomId = socket.roomId;
      console.log(`User ${socket.id} is leaving the room`);
      socket.broadcast.to(roomId).emit("user-left", { userId: socket.id });
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
      const email = socketidToEmailMap.get(socket.id);
      if (email) {
        emailToSocketIdMap.delete(email);
        socketidToEmailMap.delete(socket.id);
      }
    });
  });
};

module.exports = { handleSocketConnection };
