import React from 'react'

import Auth from './pages/Auth';
import { Homepage } from './pages/Homepage';
import VideoCallScreen from './pages/VideoCallScreen';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import NotFound from './pages/NotFound';
import Rejoin from './pages/Rejoin';

import ProfilePage from './pages/Profile';
import JoinMeeting from './pages/JoinMeeting';
import EditProfile from './pages/EditProfile';

const App = () => {
  return (
    <div className='app-container'>
<Router>
  <Routes>
    <Route path='/' element={<Homepage/>} />
    <Route path='/auth' element={<Auth/>} />
    <Route path='/profile' element={<ProfilePage/>} />
    <Route path='/join-meeting/:roomId' element={<JoinMeeting/>} />
    <Route path='/rejoin' element={<Rejoin/>} />
    <Route path='/edit-profile' element={<EditProfile/>} />

    <Route path="/room/:roomId" element={<VideoCallScreen/>} />
<Route path="*" element={<NotFound/> } />
  </Routes>
</Router>
    </div>
  )
}

export default App
