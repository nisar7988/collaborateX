import React, {useEffect, useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';

const JoinMeeting = () => {
  const [room, setroom] = useState('');
  const [email, setemail] = useState('');
  const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );


  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);



  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Join a Meeting</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={room}
          onChange={(e) => setroom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          onClick={handleSubmitForm}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default JoinMeeting;
