import React, { useState, useEffect, useRef, useCallback } from "react";
import MeetingCard from '../components/MeetingCard'
import ReactPlayer from "react-player";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaHandPaper,
  FaPhoneSlash,
  FaMicrophone,
 FaMicrophoneSlash,
  FaVideo,
  FaShareSquare,
  FaUserPlus,
  FaCog,
  FaCommentDots ,
  FaVideoSlash,
} from "react-icons/fa";
import { useSocket } from "../context/SocketProvider";
import peer from "../services/peer.js";
import userimg from "../assets/user.png";
import ChatBox from "../components/ChatBox";
import ParticipantsDrawer from "../components/ParticipantsDrawer";

const VideoCallScreen = () => {
  const navigate=useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRoomCode,setShowRoomCode]=useState(true)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const socket = useSocket();
const [isAudio,setIsAudio]=useState(true)
const [isVideo,setisVideo]=useState(true)
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const[ participants,setParticipants]=useState([])
    async function getParticipants(){
      console.log('getpparticipants')
      try{
        const response= await axios.get('http://localhost:3000/')
        console.log(response)
        setParticipants(response.data.participants || []);
      }
      catch(err){
        console.log(err)
      }
    }
 useEffect(()=>{
  getParticipants()
 },[setParticipants ])
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
   
    setRemoteSocketId(id);

  }, []);

  const handleCallUser = useCallback(async () => {
    console.log('handleCalluser')

    console.log("getting offer")
    const offer = await peer.getOffer();
    console.log('got the offer')
    socket.emit("user:call", { to: remoteSocketId, offer });

  }, [remoteSocketId, socket]);
const openCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: isAudio,
        video: isVideo,
      });
      setMyStream(stream);
    } catch (err) {
      console.error("Failed to open camera", err);
    }
  }, [isAudio, isVideo]);

  useEffect(() => {
    openCamera();
  }, [openCamera,isVideo,isAudio]);
  const handleIncommingCall = useCallback(
    
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        const sender = peer.peer.getSenders().find((s) => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        } else {
          peer.peer.addTrack(track, myStream);
        }
      });
    }
  }, [myStream]);
  const leaveRoom = useCallback(() => {
    socket.emit("leave-room");  // Emit the leave-room event to the server

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());  // Stop all media tracks
    }
    navigate("/rejoin");  // Redirect to a "goodbye" page or any other page
  }, [socket, myStream, navigate]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      console.log("call accepts");
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      peer.addEventListener("track", handleTrackEvent); 
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);
  

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      try{

        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
      }
      catch(err){
        console.log('eeror encountere when getting offer ',err);
      }

    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
  console.log('opening camera');

    peer.peer.addEventListener("track", async (ev) => {
console.log('setting remote Stream');

      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
      console.log('remote stream is set',remoteStream[0]);
      console.log('sending stream');

      sendStreams()
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  useEffect(() => {
if(remoteSocketId){
  handleCallUser();
}
  }, [remoteSocketId]);
  useEffect(() => {
    if (myStream) {
      sendStreams();
    }
  }, [myStream]);
 const toggleAudio = useCallback(() => {
  if (myStream) {
    const audioTrack = myStream.getAudioTracks()[0];
    if (audioTrack) {
      console.log("Toggling audio track", audioTrack);
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudio(audioTrack.enabled);
    } else {
      console.log("No audio track found");
    }
  }
}, [myStream]);

const toggleVideo = useCallback(() => {
  if (myStream) {
    let videoTrack = myStream.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setisVideo(videoTrack.enabled);
    } else {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((newStream) => {
          const newVideoTrack = newStream.getVideoTracks()[0];
          const videoSender = peer.peer.getSenders().find((sender) => sender.track.kind === 'video');
          
          if (videoSender) {
            videoSender.replaceTrack(newVideoTrack);
          } else {
            peer.peer.addTrack(newVideoTrack, myStream);
          }

          myStream.addTrack(newVideoTrack); // Add the new video track to the existing stream
          setMyStream(newStream); // Update the stream with the new one
          setisVideo(true);
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });
    }
  }
}, [myStream]);


  const closePrticipants=()=>{
    setIsParticipantsOpen(false);
  }

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="flex-grow bg-gray-900  flex items-center justify-center relative">
          <div className="w-full h-full flex  items-center justify-center  bg-black">
            {isVideo && (
              <div className="absolute z-40 bottom-[13vh] right-[3vw] border-2 border-red-500">
                <ReactPlayer
                  autoPlay
                  playing
                  muted
                  url={myStream}
                  width="300px"
                  height="auto"
                />
              </div>
            )}
{console.log(remoteStream)}
            {remoteStream ? (
                <div className="flex-1   h-screen w-screen border-2 border-cyan-500">
                  <ReactPlayer
                    playing
                    muted
                    url={remoteStream}
                    className="mt-2"
                    width="inherit"
                    height="85vh"
                  />
                </div>
            ) : (
              <>
                <div className="text-white flex items-center justify-center flex-col">
                  <img src={userimg} alt="user" className="rounded-full" />
                  <span>Waiting for other user...</span>
                  <div className="bg-cyan-700"></div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 justify-between py-2 bg-transparent absolute bottom-0 w-full">
          <div className="time flex items-center text-white px-4">
            <span className="px-2 border-r-2">2:30 AM</span>
            <span className="px-2">nisarahmed000</span>
          </div>
          <div  className="buttons flex justify-center items-center space-x-1">
            <button onClick={toggleAudio} className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
             {isAudio?  <FaMicrophone className="text-2xl" />:<FaMicrophoneSlash className="text-2xl" />}
              <span className="text-xs mt-1">Mute</span>
            </button>

         
            <button onClick={toggleVideo} className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
            {isVideo?  <FaVideo className="text-2xl" />:<FaVideoSlash className="text-2xl" />}
              <span className="text-xs mt-1" >Camera</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
              <FaShareSquare className="text-2xl" />
              <span className="text-xs mt-1">Share</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
              <FaHandPaper className="text-2xl" />
              <span className="text-xs mt-1">Reactions</span>
            </button>
            <button onClick={leaveRoom } className="flex flex-col items-center justify-center bg-red-600 text-white font-bold h-12 px-3 rounded">
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
            <span className="text-xs mt-1">Add People</span>
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
          >
            <FaCommentDots className="text-2xl" />
            <span className="text-xs mt-1">Chat</span>
          </button>
          <button className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
            <FaCog className="text-2xl" />
            <span className="text-xs mt-1">Settings</span>
          </button>
          </div>
        </div>
      </div>
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ParticipantsDrawer isOpen={isParticipantsOpen} onClose={()=>setIsParticipantsOpen(false)} participants={participants} />
  {showRoomCode&& <MeetingCard setShowRoomCode={setShowRoomCode} />}
     
    </>
  );
};

export default VideoCallScreen;
