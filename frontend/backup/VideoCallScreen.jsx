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
import { ShowNotification } from "../components/ShowNotification.jsx";
import AllUserVideos from "../components/AllUserVideos.jsx";
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
const VideoCallScreen = () => {
  const { mediaStreams, addStream, removeStream } = useMediaStreams();
  const host = window.location.host;
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [allMediaStream,setAllMediaStream] = useState({})
  const [isNotification, setIsNotification] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const socket = useSocket();

  const [isAudio, setIsAudio] = useState(true);
  const [isVideo, setIsVideo] = useState(true);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(null);
  // const remoteStreamsRef = useRef({});

  // Store all remote streams in  a map
  //consoles
  console.log(mediaStreams);
  //functions
  async function getParticipants() {
    console.log("getpparticipants");
    try {
      const response = await axios.get("http://localhost:3000/");
      console.log(response);
      setParticipants(response.data.participants || []);
    } catch (err) {
      console.log(err);
    }
  }

  // async function fetchStream() {
  //   console.log("fetching stream");
  //   try {
  //     const response = await axios.get("http://localhost:3000/get-stream");
  //     console.log(response);
  //     setAllStreams(response.data || []);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const handleCallUser = useCallback(async () => {
    console.log("handleCalluser");

    console.log("getting offer");
    const offer = await peer.getOffer();
    console.log("got the offer");
    try {
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (err) {
      console.log(err);
    }
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

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      try {
        setRemoteSocketId(from);
        console.log(`Incoming Call`, from, offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      } catch (err) {
        console.log(err);
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        const sender = peer.peer
          .getSenders()
          .find((s) => s.track?.kind === track.kind);
        if (sender) {
          sender.replaceTrack(track);
        } else {
          peer.peer.addTrack(track, myStream);
        }
      });
    }
  }, [myStream]);

  const leaveRoom = useCallback(() => {
    socket.emit("leave-room"); // Emit the leave-room event to the server

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      removeStream(socket.id);
    }
    navigate("/rejoin"); // Redirect to a "goodbye" page or any other page
  }, [socket, myStream, navigate]);

  const handleTrackEvent = async (ev) => {
    const newRemoteStream = ev.streams[0];
    const userId = socket.id;
    try {
      addStream(userId, newRemoteStream);
      // remoteStreamsRef.current[userId] = newRemoteStream;
      // dispatch(ADD_REMOTE_STREAM({ streamId: userId, stream: newRemoteStream } ));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      console.log("call accepts");
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      peer.peer.addEventListener("track", handleTrackEvent);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      try {
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
      } catch (err) {
        console.log("eeror encountere when getting offer ", err);
      }
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const toggleAudio = useCallback(() => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      if (audioTrack) {
        console.log("Toggling audio track", audioTrack);
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudio(!audioTrack.enabled);
        // dispatch(TOGGLE_AUDIO());
      } else {
        console.log("No audio track found");
      }
    }
  }, [myStream]);

  const localVideoToggle = useCallback(() => {
    if (myStream) {
      let videoTrack = myStream.getVideoTracks()[0]; // Get the current video track

      if (videoTrack) {
        // Toggle the enabled state of the existing video track
        videoTrack.enabled = !videoTrack.enabled;
        // dispatch(TOGGLE_VIDEO());
        setIsVideo(videoTrack.enabled);

        // Emit the new video state to the remote peer
        socket.emit("video-status-changed", videoTrack.enabled);
      } else {
        // If no video track exists, request access to the camera
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((newStream) => {
            const newVideoTrack = newStream.getVideoTracks()[0]; // Get the new video track
            const videoSender = peer.peer
              .getSenders()
              .find((sender) => sender.track?.kind === "video");

            if (videoSender) {
              // Replace the current video track with the new one
              videoSender.replaceTrack(newVideoTrack);
            } else {
              // If no video sender exists, add the new video track to the peer connection
              peer.peer.addTrack(newVideoTrack, newStream);
            }

            // Update the local stream (`myStream`) with the new video track
            setMyStream((prevStream) => {
              const updatedStream = new MediaStream(prevStream);
              updatedStream.addTrack(newVideoTrack);
              return updatedStream;
            });

            setIsVideo(true);

            // Emit the new video state to the remote peer
            socket.emit("video-status-changed", true);
          })
          .catch((error) => {
            console.error("Error accessing the camera:", error);
          });
      }
    }
  }, [myStream, peer, socket]);

  const closePrticipants = () => {
    setIsParticipantsOpen(false);
  };

  const renderRemoteStreams = () => {
    return Object.values(allMediaStream).map((remoteStream, index) => (
      <div className="relative">
        {" "}
        {/* Add relative container */}
        <div className="w-max-content h-max-content  " key={index}>
          <ReactPlayer
            playing
            muted
            url={remoteStream}
            className="mt-2 relative z-10 "
            width="auto"
            height="auto"
          />
        </div>
        <span
          className="username pl-2 absolute bottom-0 left-0 text-white text-xl"
          style={{ zIndex: 20 }}
        >
          You
        </span>
        <span className="username pl-2 absolute top-4 right-4 text-white text-sm">
          {isAudio ? (
            <FaMicrophone className="text-2xl" />
          ) : (
            <FaMicrophoneSlash className="text-2xl" />
          )}
        </span>
      </div>
    ));
  };
  //useEffects
useEffect(()=>{
setAllMediaStream(mediaStreams)
},[mediaStreams])


  useEffect(() => {
    openCamera();
  }, [openCamera]);

  useEffect(() => {
    getParticipants();
  }, [setParticipants]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    console.log("opening camera");
    peer.peer.addEventListener("track", handleTrackEvent);
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
    if (remoteSocketId) {
      handleCallUser();
    }
  }, [remoteSocketId]);

  useEffect(() => {
    if (myStream) {
      sendStreams();
    }
  }, [myStream]);

  useEffect(() => {
    socket.on("video-status-changed", (isVideoOn) => {
      setIsRemoteVideoOn(isVideoOn);
    });
    return () => {
      socket.off("video-status-changed");
    };
  }, []);

  //return jsx
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="flex-grow bg-gray-900  flex items-center justify-center relative">
          <div className="w-full h-full flex  items-center justify-center  bg-black">
            {isVideo && (
              <div className="absolute flex flex-col z-40 bottom-[13vh] right-[3vw] shadow-md  ">
                <ReactPlayer
                  autoPlay
                  playing
                  muted
                  url={myStream}
                  width="200px"
                  height="auto"
                  className="z-1 relative rounded-full"
                />
                <span className="username absolute bottom-0 z-2  text-white text-xl ">
                  You
                </span>
              </div>
            )}

            {Object.keys(mediaStreams).length > 0 ? (
              renderRemoteStreams()
            ) : (
              <div className="text-white flex items-center justify-center flex-col">
                <img src={userimg} alt="user" className="rounded-full" />
                <span>Waiting for other user...</span>
                <div className="bg-cyan-700"></div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 justify-between py-2 bg-transparent absolute bottom-0 w-full">
          <div className="time flex items-center text-white px-4">
            <span className="px-2 border-r-2">2:30 AM</span>
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
              onClick={localVideoToggle}
              className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
            >
              {isVideo ? (
                <FaVideo className="text-2xl" />
              ) : (
                <FaVideoSlash className="text-2xl" />
              )}
              <span className="text-xs mt-1">Camera</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
              <FaShareSquare className="text-2xl" />
              <span className="text-xs mt-1">Share</span>
            </button>
            <button className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded ">
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
              <span className="text-xs mt-1">Add People</span>
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
            <button
              onClick={() => setShowAllParticipants(!showAllParticipants)}
              className="flex flex-col items-center justify-center text-white font-bold py-2 px-3 rounded "
            >
              <BiBorderAll className="text-2xl" />
              <span className="text-xs mt-1">Paritcipants</span>
            </button>
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
