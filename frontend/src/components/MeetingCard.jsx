import React, { useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { AiOutlineClose, AiOutlineUserAdd, AiOutlineCopy } from 'react-icons/ai'; // React Icons
import AlertComponent from './AlertComponent';

const MeetingCard = (props) => {
  const [isCopied,setIsCopied]=useState(false)
    const {setShowRoomCode,url}=props
  const userId = "user@example.com"; // Replace with the actual user ID

  // Function to handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(()=>{
      setIsCopied(false)
    },1000)

  };

  return (
    <Card className="max-w-sm p-4 z-10 absolute bottom-3">
      {/* Heading and Close Icon */}
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-xl font-bold">Your meeting is ready</h5>
        <AiOutlineClose className="w-5 h-5 cursor-pointer" onClick={()=>setShowRoomCode(false)} />
      </div>

      {/* Add Participant Button */}
      <Button
        color="blue"
        pill={true}
        className="flex items-center w-max justify-center py-2"
      >
        <AiOutlineUserAdd className="w-5 h-5 mr-2" />
        Add Participant
      </Button>

      {/* Copy Link Text */}
      <div className="text-gray-500 mb-2">
      {isCopied? <span className='text-green-500 font-semibold'>link copied to clipboard!</span>:  'Copy link to share meeting'}
      </div>

      {/* Static Copy Text with Icon (Clickable) */}
      <div
        className="flex items-center text-gray-500 cursor-pointer"
        onClick={handleCopy}
      >
        <AiOutlineCopy className="w-5 h-5 mr-2" />
        <span>{url}</span>
      </div>

      {/* User ID Display */}
      <div className="text-gray-500 mt-2">
        You joined as <span className="font-semibold">{userId}</span>
      </div>
    </Card>
  );
};

export default MeetingCard;
