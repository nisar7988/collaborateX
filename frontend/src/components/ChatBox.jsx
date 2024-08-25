import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatBox = ({ isOpen, onClose }) => {
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
          Close
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Message from another user */}
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
            <p className="text-sm font-semibold">User1</p>
            <p className="text-sm text-gray-700">
              Hey! How's the meeting going?
            </p>
          </div>
        </div>

        {/* Message from the current user */}
        <div className="flex justify-end">
          <div className="bg-cyan-700 text-white rounded-lg p-3 max-w-xs">
            <p className="text-sm font-semibold">You</p>
            <p className="text-sm">
              It's going well! Just discussing the project updates.
            </p>
          </div>
        </div>

        {/* Another message from another user */}
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
            <p className="text-sm font-semibold">User3</p>
            <p className="text-sm text-gray-700">
              Can we schedule another meeting for tomorrow?
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-300 flex items-center">
        <input
          type="text"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none"
          placeholder="Type a message..."
        />
        <button className="ml-2 bg-blue-600 text-white p-2 rounded-lg">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
