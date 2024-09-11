import React,{useState,useEffect} from "react";
import { FaShareSquare, FaUserPlus, FaCheck, FaTimes } from "react-icons/fa";
import axios from 'axios'
const ParticipantsDrawer = ({ isOpen, onClose,participants=[],setShowRoomCode }) => {
console.log(participants)


  return (
    <div
      className={`fixed z-50 right-0 top-0 w-full md:w-1/3 h-full bg-white shadow-lg flex flex-col transition-transform transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="bg-cyan-700 text-white p-4 font-bold flex justify-between items-center">
        <span>Participants</span>
        <button onClick={onClose} className="text-white text-2xl">
          &times;
        </button>
      </div>

      {/* Pending Requests */}
      {/* <div className="p-4 border-b border-gray-300 bg-gray-100">
        <h2 className="text-lg font-semibold">Pending Requests</h2>
        <div className="mt-2 space-y-2">
          <div className="bg-gray-200 p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm font-semibold">User4</span>
            <div className="flex space-x-2">
              <button className="text-green-500">
                <FaCheck />
              </button>
              <button className="text-red-500">
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="bg-gray-200 p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm font-semibold">User5</span>
            <div className="flex space-x-2">
              <button className="text-green-500">
                <FaCheck />
              </button>
              <button className="text-red-500">
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Participants List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
       {participants.map((value,index)=>{
        return(
          <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
          <span className="text-sm font-semibold">{value}</span>
          <span className="text-xs text-gray-500">Joined</span>
        </div>
       
        )
       })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-300 flex items-center justify-between">
        <button className="flex items-center bg-cyan-700 text-white py-2 px-4 rounded hover:bg-cyan-800" 
         onClick={()=>{setShowRoomCode(true)}}
         >
          <FaShareSquare className="text-xl mr-2" />
          Share Link
        </button>
        {/* <button className="flex items-center bg-cyan-700 text-white py-2 px-4 rounded hover:bg-cyan-800">
          <FaUserPlus className="text-xl mr-2" />
          Add Participant
        </button> */}
      </div>
    </div>
  );
};

export default ParticipantsDrawer;
