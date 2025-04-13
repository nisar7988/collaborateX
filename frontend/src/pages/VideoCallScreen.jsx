import React, { useState, useEffect, useRef, useCallback } from "react";
import MeetingCard from "../components/MeetingCard";
import ReactPlayer from "react-player";
import { BiBorderAll } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import peer from "../services/peer.js";
import userimg from "../assets/user.png";
import ChatBox from "../components/ChatBox";
import ParticipantsDrawer from "../components/ParticipantsDrawer";
import axios from "axios";
import ShowNotification from "../components/ShowNotification.jsx";
import AllUserVideos from "../components/AllUserVideos.jsx";
//other
import Peer from "simple-peer";

import {
  FaHandPaper,
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaShareSquare,
  FaUserPlus,
  FaCog,
  FaCommentDots,
  FaVideoSlash,
} from "react-icons/fa";
import { useMediaStreams } from "../context/mediaStreamProvider.jsx";

// Update the getGridLayout helper function for better height management
const getGridLayout = (peerCount) => {
  if (peerCount === 0) return 'grid-cols-1 h-[85vh]';
  if (peerCount === 1) return 'grid-cols-1 md:grid-cols-1 h-[85vh]';
  if (peerCount === 2) return 'grid-cols-1 md:grid-cols-2 h-[85vh]';
  if (peerCount === 3) return 'grid-cols-2 md:grid-cols-3 h-[85vh]';
  return 'grid-cols-2 md:grid-cols-3 h-[85vh]';
};

const VideoCallScreen = () => {
  const { mediaStreams, addStream, removeStream } = useMediaStreams();
  const host = window.location.host;
  const { roomId } = useParams();
  const [showPeople, setShowPeople] = useState(false);
  const navigate = useNavigate();
  const [allMediaStream, setAllMediaStream] = useState({});
  const [isNotification, setIsNotification] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const socket = useSocket();
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(null);

  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = useParams();
  //fucntions
  async function getParticipants() {
    console.log("getpparticipants");
    try {
      const response = await axios.get("https://collaboratex.onrender.com/");
      console.log(response);
      setParticipants(response.data.participants || []);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=>{
    getParticipants();
  },[peers,socket])
  // Update the Video component with better height control
  const Video = ({ peer, isMainVideo }) => {
    const ref = useRef();
    
    useEffect(() => {
      peer.on("stream", (stream) => {
        if (ref.current) {
          ref.current.srcObject = stream;
        }
      });
    }, [peer]);
  
    return (
      <div className={`relative rounded-lg overflow-hidden ${
        isMainVideo 
          ? 'h-full max-h-[85vh] flex items-center justify-center' 
          : 'h-full'
      }`}>
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${
            isMainVideo ? 'max-h-[85vh]' : ''
          }`}
        />
        <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-full">
          <span className="text-white text-sm">User</span>
        </div>
      </div>
    );
  };

  // Video constraints
  const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2,
  };

  // Styled components for layout

  useEffect(() => {
    // Get user media for video and audio
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        setMyStream(stream);
        // userVideo.current.srcObject = stream;
        console.log(stream);
        // Receive all existing users
        socket.emit("join room", roomID);
        socket.on("all users", (users) => {
          console.log("alluser");
          const peers = [];
          users.forEach((userId) => {
            const peer = createPeer(userId, socket.id, stream);
            peersRef.current.push({
              peerId: userId,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        // When a new user joins
        socket.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerId: payload.callerID,
            peer,
          });
          setPeers((users) => [...users, peer]);
        });

        // Receiving returned signal from the peer
        socket.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerId === payload.id);
          if (item) {
            item.peer.signal(payload.signal);
          }
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, [roomID, socket]);

  // Create a new peer connection to signal the new user
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: "stun:global.stun.twilio.com:3478" }],
      },
    });

    peer.on("signal", (signal) => {
      socket.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  // Add a new peer when receiving a signal from the other user
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
      config: {
        iceServers: [{ urls: "stun:global.stun.twilio.com:3478" }],
      },
    });

    peer.on("signal", (signal) => {
      socket.emit("returning signal", {
        signal,
        callerID,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleAudio = () => {
    setIsAudio(!isAudio);
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = !isAudio;
    }
  };

  const toggleVideo = () => {
    setIsVideo(!isVideo);
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = !isVideo;
    }
  };

  const leaveRoom = useCallback(() => {
    socket.emit("leave-room"); // Emit the leave-room event to the server

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      removeStream(socket.id);
    }
    navigate("/rejoin"); // Redirect to a "goodbye" page or any other page
  }, [socket, myStream, navigate]);

  const handleReaction = () => {
    if (roomId) {
      socket.emit("message", { message: "✋", room: roomId });
      setMessage("");
    } else {
      alert("Please join a room first!");
    }
  };
  //return jsx
  useEffect(() => {
    socket.on("receive-message", (data) => {
      const { message, id, name } = data;
      console.log("Message received:", data);
      setMessageArr((prevMessages) => [...prevMessages, { message, id, name }]);
      setIsNotification(true);
    });
  }, []);
  return (
    <>
      <div className="h-screen flex flex-col bg-gray-900">
        <div className="flex-grow relative overflow-hidden">
          <div className="absolute inset-0 p-4">
            {/* Main video grid with fixed height */}
            <div className={`grid ${getGridLayout(peers.length)} gap-4`}>
              {peers.length > 0 ? (
                peers.map((peer, index) => (
                  <Video 
                    key={index} 
                    peer={peer} 
                    isMainVideo={peers.length === 1}
                  />
                ))
              ) : (
                <div className="flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center text-white">
                    <img 
                      src={userimg} 
                      alt="user" 
                      className="w-24 h-24 mx-auto rounded-full mb-4" 
                    />
                    <p className="text-lg">Waiting for others to join...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Adjust local video overlay position to prevent overlap */}
            <div className="absolute bottom-24 right-4 w-48 aspect-video rounded-lg overflow-hidden shadow-lg z-10">
              {myStream && isVideo ? (
                <ReactPlayer
                  playing
                  muted
                  url={myStream}
                  width="100%"
                  height="100%"
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800">
                  <img 
                    src={userimg} 
                    alt="user" 
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-full">
                <span className="text-white text-sm">You</span>
              </div>
            </div>
          </div>
        </div>

        {/* Move controls up slightly to ensure no overflow */}
        <div className=" backdrop-blur-md py-3 px-6 mt-auto">
          <div className="grid grid-cols-3 justify-between py-2 bg-transparent absolute bottom-0 w-full">
            <div className="time flex items-center text-white px-4">
              <span className="px-2 border-r-2">Meeting</span>
              <span className="px-2">{roomId}</span>
            </div>
            <div className="buttons flex justify-center items-center space-x-1">
              <button
                onClick={toggleAudio}
                className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
              >
                {isAudio ? (
                  <FaMicrophone className="text-2xl" />
                ) : (
                  <FaMicrophoneSlash className="text-2xl" />
                )}
                <span className="text-xs mt-1">Mute</span>
              </button>

              <button
                onClick={toggleVideo}
                className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
              >
                {isVideo ? (
                  <FaVideo className="text-2xl" />
                ) : (
                  <FaVideoSlash className="text-2xl" />
                )}
                <span className="text-xs mt-1">Camera</span>
              </button>
              <button
                onClick={handleReaction}
                className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
              >
                <FaHandPaper className="text-2xl" />
                <span className="text-xs mt-1">Reactions</span>
              </button>
              <button
                onClick={leaveRoom}
                className="flex flex-col items-center justify-center bg-red-600 text-white font-bold h-12 px-3 rounded"
              >
                <FaPhoneSlash className="text-2xl" />
                <span className="text-xs mt-1">Leave</span>
              </button>
            </div>
            <div className="flex">
              <button
                onClick={() => setIsParticipantsOpen(true)}
                className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
              >
                <FaUserPlus className="text-2xl" />
                <span className="text-xs mt-1">Participants</span>
              </button>
              <button
                onClick={() => {
                  setIsChatOpen(true);
                  setIsNotification(false);
                }}
                className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded relative "
              >
                {isNotification && <ShowNotification />}
                <FaCommentDots className="text-2xl" />
                <span className="text-xs mt-1">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ChatBox
        setIsNotification={setIsNotification}
        room={roomId}
        socket={socket}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      <ParticipantsDrawer
      setShowRoomCode={setShowRoomCode}
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        participants={participants}
      />
      {showRoomCode && (
        <MeetingCard
          url={`${host}/join-meeting/${roomId}`}
          setShowRoomCode={setShowRoomCode}
        />
      )}
    </>
  );
};

export default VideoCallScreen;
