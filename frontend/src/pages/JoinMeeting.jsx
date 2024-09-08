import React, {useEffect, useState,useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';
import logo from '../assets/collaborateX.png'
import { Button } from 'flowbite-react';
const JoinMeeting = () => {
const {roomId} = useParams();
  const [email, setemail] = useState('');
  const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmitForm = useCallback(
    (e) => {
      console.log(roomId)
      e.preventDefault();
      navigate(`/room/${roomId}`);
      // socket.emit("join room", { email, roomId });
    },
    [email, roomId, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, roomId } = data;
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );


  useEffect(() => {
    socket.on("join room", handleJoinRoom);
    return () => {
      socket.off("join room", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);



  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-1/3 p-6 rounded shadow-md">
      <div className="logo  text-center">
        <img src={logo} alt="logo" className="w-1/2 mx-auto" />
      </div>
        <h2 className="text-2xl font-bold mb-4">Join a Meeting</h2>
        <input
          type="text"
          placeholder="Enter email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <Button
        gradientMonochrome="cyan"
          className="w-full  p-2 rounded"
          onClick={handleSubmitForm}
        >
          Join Meeting
        </Button>
        
      </div>
    </div>
  );
};

export default JoinMeeting;
