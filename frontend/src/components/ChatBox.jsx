import React, { useEffect,useState } from "react";
import { FaPaperPlane,FaTimes } from "react-icons/fa";

const ChatBox = ({ isOpen, onClose,room,socket,setIsNotification }) => {
  const [message, setMessage] = useState('');
  const [messageArr, setMessageArr] = useState([]);
  const sendMsg = (e) => {
    if (room && socket) {
      socket.emit("message", { message, room });
      setMessage("");
    } else {
      alert("Please join a room first!");
    }
  };
console.log(messageArr,'and',socket)
useEffect(()=>{
  socket.on("receive-message", (data) => {
    const{message,id,name}=data;
    console.log("Message received:", data);
    setMessageArr((prevMessages) => [...prevMessages, {message,id,name}]);
    setIsNotification(true)
  });

},[])
  return (
    <div
      className={`fixed right-0 bottom-0 w-full md:w-1/3 h-full bg-white shadow-lg flex flex-col z-50 transition-transform transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="bg-cyan-700 text-white p-4 font-bold flex justify-between items-center">
        Chat
        <button onClick={onClose} className="text-white">
        <FaTimes/>
        </button>
      </div>
<div className="chat-container h-[78%]  overflow-y-scroll">


      {/* Chat Messages */}
      {messageArr.map((item,index)=>{
return item.id===socket.id ? 
  <div key={index} className="flex justify-end my-1">
    <div className="bg-cyan-700 text-white rounded-lg p-3 max-w-xs">
      <p className="text-sm font-semibold">You</p>
      <p className="text-sm">
   <span>{item.message}</span>
      </p>
    </div>
  </div> :
   <div key={index} className="flex justify-start my-1">
     <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
       <p className="text-sm font-semibold">{item.name}</p>
       <p className="text-sm text-gray-700">
       {item.message}
         
       </p>
     </div>
   </div>

      })}
   </div>
      {/* Input Area */}
      <div className="p-4 backdrop-blur-md border-t fixed bottom-0 w-full border-gray-300 flex items-center">
        <input
          type="text"
          value={message}
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMsg} className="ml-2 bg-blue-600 text-white p-2 rounded-lg">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
