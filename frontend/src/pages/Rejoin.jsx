import React from 'react'
import { useNavigate } from 'react-router-dom'
import TimeoutSpinner from '../components/TimeoutSpinner'
import { Button } from 'flowbite-react'

const Rejoin = () => {
    const navigate = useNavigate();
  return (
<div>

  <TimeoutSpinner/>
  <div className="main-container flex justify-around items-center flex-col  m-auto w-[50vw] p-3">
    <h2 className='text-4xl font-bold my-5'>You Left the Meeting!</h2>
  <div className='flex'>  <Button className="max-w-xs mx-3 px-2 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-500 hover:text-white bg-transparent text-cyan-700 border-2 border-cyan-800 hover:border-none">ReJoin meeting </Button>
  <Button onClick={()=>navigate("/")} gradientMonochrome="cyan">Go To Homepage</Button></div>
  </div>
</div>
  )
}

export default Rejoin
