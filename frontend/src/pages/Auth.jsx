import React, { useState } from "react";
import logo from "../assets/collaborateX.png";
import Login from "../components/Login";
import Signup from "../components/Signup";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="md:grid md:grid-cols-2 justify-center bg-sky-50  flex-col md:flex-row items-center md:justify-between h-screen overflow-hidden">
      <div className="logo hidden md:flex  h-1/2   items-center">
        <img src={logo} alt="logo" />
      </div>
      <div className="flex justify-center items-center h-full w-full ">
        {isLogin ? (
          <Login setIsLogin={setIsLogin} />
        ) : (
          <Signup setIsLogin={setIsLogin} />
        )}
      </div>
    </div>
  );
};

export default Auth;
