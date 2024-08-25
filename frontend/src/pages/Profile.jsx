import React from 'react';
import { Card, Button } from 'flowbite-react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEdit, AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'; // React Icons for email, phone, edit, logout, and user

const ProfilePage = () => {
  const user = {
    name: "John Doe",
    bio: "A passionate developer with a love for coding and coffee.",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    profilePic: "https://via.placeholder.com/150", // Replace with actual profile picture URL
    meetings: [
      { title: "Team Sync", date: "2024-08-20", time: "10:00 AM" },
      { title: "Project Review", date: "2024-08-21", time: "2:00 PM" },
    ],
    connections: [
      { name: "Jane Smith", email: "jane.smith@example.com" },
      { name: "Alice Johnson", email: "alice.johnson@example.com" },
    ],
  };

  return (
    <div className="screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-screen-lg mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
            <p className="text-gray-600 mt-1">{user.bio}</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center text-gray-700">
                <AiOutlineMail className="w-5 h-5 mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <AiOutlinePhone className="w-5 h-5 mr-2" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button color="gray" className="flex items-center">
              <AiOutlineEdit className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
            <Button color="red" className="flex items-center">
              <AiOutlineLogout className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Your Meetings Section */}
        <Card className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Meetings</h3>
          <ul>
            {user.meetings.map((meeting, index) => (
              <li key={index} className="flex flex-col sm:flex-row justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <h4 className="font-semibold">{meeting.title}</h4>
                  <p className="text-gray-600">{meeting.date} at {meeting.time}</p>
                </div>
                <Button color="blue" size="sm" className="mt-2 sm:mt-0">
                  Join
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Your Connections Section */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Your Connections</h3>
          <ul>
            {user.connections.map((connection, index) => (
              <li key={index} className="flex flex-col sm:flex-row items-center py-2 border-b last:border-b-0">
                <AiOutlineUser className="w-5 h-5 mr-2 text-gray-700" />
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold">{connection.name}</h4>
                  <p className="text-gray-600">{connection.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
