import React, { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEdit, AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'; // React Icons for email, phone, edit, logout, and user

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userImg from '../assets/user.png'
import ConfirmBox from '../components/ConfirmBox';
import ChangeProfile from '../components/ChangeProfile'
const ProfilePage = () => {
const [showChangeProfile, setShowChangeProfile ] = useState(false)
  const [meetingData,setMeetingData] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"))
const navigate = useNavigate()
const [profilePic,setProfilePic]=useState(null)

  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  useEffect(()=>{
    if (!localStorage.getItem("id")) {
      navigate("/auth");
    }
  },[])

  const usehr = {
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
  useEffect(()=>{
    const pic =JSON.parse(localStorage.getItem("user"))['profilePicture']
   setProfilePic(pic)  
  },[])
  return (
    <>
 
<ConfirmBox  openConfirmBox={openConfirmBox} setOpenConfirmBox={setOpenConfirmBox} />
<ChangeProfile profilePic={profilePic?profilePic : userImg} showChangeProfile={showChangeProfile} setShowChangeProfile={setShowChangeProfile}/>
    <div className="screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="w-screen-lg mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center mb-6">
         <div onClick={()=>setShowChangeProfile(true)} className='relative cursor-pointer'  >
         <img 
     src={profilePic ? profilePic: userImg}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-blue-500 cursor-pointer profile-pic "
          />
             <div >
          <AiOutlineEdit className="w-5 h-5 mr-2 absolute bottom-0 right-0 hoverimg text-cyan-800 text-4xl" />
          </div>
         </div>
          <div className="sm:ml-6 mt-4 sm:mt-0  sm:text-left  text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
            <p className="text-gray-600 mt-1">{user.bio}</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center text-gray-700">
                <AiOutlineMail className="w-5 h-5 mr-2" />
                <span>{user.email}</span>
              </div>
              {user.phone && <div className="flex items-center text-gray-700">
                <AiOutlinePhone className="w-5 h-5 mr-2" />
                <span>{user.phone}</span>
              </div>}
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={()=>navigate('/edit-profile')} color="gray" className="flex items-center">
              <AiOutlineEdit className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
            <Button onClick={()=>setOpenConfirmBox(true)} color="red" className="flex items-center">
              <AiOutlineLogout className="w-5 h-5 mr-2" />
              Signout
            </Button>
          </div>
        </div>

        {/* Your Meetings Section */}
        <Card className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Meetings</h3>
          {
meetingData? (
    <ul>
      {user.meetings.map((meeting, index) => (
        <li key={index} className="flex flex-col sm:flex-row justify-between items-center py-2 border-b last:border-b-0">
          <div>
            <h4 className="font-semibold">{meeting.meetingTitle}</h4>
            <p className="text-gray-600">{meeting.meetingDate} at {meeting.meetingTime}</p>
          </div>
          <Button color="blue" size="sm" className="mt-2 sm:mt-0">
            Join
          </Button>
        </li>
      ))}
    </ul>
  ) : (
    "NO Data"
  )
}
        </Card>

        {/* Your Connections Section */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">Your Connections</h3>
          {user.connections.length>0 ?(
          <ul>
            {user.connections.map((connection, index) => (
              <li key={index} className="flex flex-col sm:flex-row items-center py-2 border-b last:border-b-0">
                <AiOutlineUser className="w-5 h-5 mr-2 text-gray-700" />
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold">{connection.name}</h4>
                  <p className="text-gray-600">{connection.email}</p>
                </div>
              </li>
            )) }
          </ul>
  )  : ( "NO Connection")
          
        }
        </Card>
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
