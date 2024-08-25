import { FooterComponent } from "../components/FooterComponent";
import NavigationBar from "../components/Navbar";
// import img1 from "../assets/img1.jpg";
// import img2 from "../assets/img2.jpg";
import { Button } from "flowbite-react";
import { IoVideocam } from "react-icons/io5";
import { MdKeyboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import CarouselComponent from "../components/CarouselComponent";
import { useSocket } from "../context/SocketProvider";
export function Homepage() {
  const navigate = useNavigate();
  const socket = useSocket();
  console.log(socket)
//pase from other
const [email, setEmail] = useState("nisarahmed7988@gmail.ocm");
  const [room, setRoom] = useState("1");


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

  //login usereffect
  useEffect(() => {
    if (!localStorage.getItem("id")) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <>
      <NavigationBar />
      <div className="flex flex-col   custom-md:flex-row justify-between mt-5 px-4 custom-md:px-8">
        <div className="flex flex-col justify-center w-full custom-md:w-1/2 mb-4 custom-md:mb-0 border-b-2 border-slate-400">
          <h3 className="text-3xl custom-md:text-4xl text-cyan-800 font-semibold mb-4 text-center custom-md:text-left">
            Fast & secure video conferencing with CollaborateX
          </h3>
          <p className="py-3 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, eaque hic! Temporibus magnam quas
            exercitationem, alias ab pariatur velit.
          </p>
          <div className="flex flex-col custom-md:flex-row items-center custom-md:items-center py-2 space-y-2 custom-md:space-y-0 custom-md:space-x-4">
            <Button
              onClick={handleSubmitForm}
          
              className="max-w-xs py-2 px-4 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-500 hover:text-white bg-transparent text-cyan-700 border-2 border-cyan-800 hover:border-none"
            >
              <IoVideocam className="text-xl mx-1 font-bold" /> Start Now
            </Button>
            <div className="flex items-center p-2 rounded border-2 border-slate-100 focus-within:border-cyan-700">
              <MdKeyboard className="text-xl mx-1" />
              <input
                className="border-none focus:outline-none focus:ring-0"
                id="small"
                type="text"
                placeholder="Enter Via Code"
              
                onChange={(e) => setRoomCode(e.target.value)}
              />
            </div>
            <label
              onClick={() => roomCode && handleJoinRoom({ roomid: roomCode })}
              className="cursor-pointer text-slate-300 hover:text-cyan-600 font-bold text-lg custom-md:text-xl"
            >
              Join
            </label>
          </div>
        </div>

        <div className="relative w-full custom-md:w-1/2 custom-md:p-8 flex items-center justify-center mb-4 custom-md:mb-0">
          <CarouselComponent />
        </div>
      </div>
      <FooterComponent className='' />
    </>
  );
}
