import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import logo from '../assets/collaborateX.png'
import AlertComponent from "../components/AlertComponent";
import { FaLeaf } from "react-icons/fa";


const Login = (props) => {
  const {setIsLogin}=props;
  const [colorAlert,setColorAlert] = useState("")
  const [colorText,setColorText] = useState("")
  const [showAlert,setShowAlert]=useState(false)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {

    let det = JSON.parse(localStorage.getItem("user"));
    if (det) {
      console.log("hai");
      navigate("/profile");
    }
  }, []);
  const [username, setUserName] = useState({
    email: "",
    password: "",
  });
  const [eyeIcon, setEyeIcon] = useState(<IoEyeOutline />);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserName({ ...username, [name]: value });
     let error = "";
    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "email is required.";
        } else {
          error = "";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters.";
        } else {
          error = "";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("login");
    console.log(username);
    try {
      const res = await axios.post("https://collaboratex.onrender.com/api/auth/login", username);

      console.log(res);
      if (res.status === 200) {
        console.log(res.data.user);
        const { _id, ...rest } = res.data.user;
        console.log(_id);
        console.log(rest); // The rest of the data without _id
        localStorage.setItem("user", JSON.stringify(rest));
        localStorage.setItem("id", JSON.stringify(_id));
     setColorAlert("success");
     setColorText("Login successful , redirecting to homepage!")
     setShowAlert(true)
      setTimeout(() => {
        navigate("/");
      }, 1000);
    
    } else {
  console.log('slkdjfsk');
  
 
      }

  
    } catch (err) {
      setColorAlert("failure");
      setColorText("Authentication failed! try again.")
      setShowAlert(true)
      setTimeout(() => {
        
        setShowAlert(false)
      }, 1300);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    setEyeIcon(isPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />);
  };

  return ( <>
    {showAlert && <AlertComponent color={colorAlert} text={colorText}/>}
    <div className="p-8 rounded shadow-md bg-white w-96">
   
      <div className="logo mb-6 text-center">
        <img src={logo} alt="logo" className="w-24 mx-auto" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative border-b-2 mb-3 border-cyan-700  z-0 w-full  group">
          <input
            type="text"
            name="email"
            id="email"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            value={username.email}
            onChange={handleChange}
          />

          <label
            htmlFor="username"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Username
          </label>
        </div>
        {errors.username && (
          <p className="text-red-500 text-xs mb-3">{errors.username}</p>
        )}
        <div className="relative border-b-2 border-cyan-700 z-0 w-full mb-1 group hover:blue-red-900 ">
          <input
            type={isPasswordVisible ? 'text':'password'}
            name="password"
            id="password"
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={username.password}
            onChange={handleChange}
            />
            <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {eyeIcon}
          </span>
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-2">{errors.password}</p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 w-full mb-2"
            disabled={!!errors.username || !!errors.password}
          >
            Login
          </button>
        </div>
        <p>
          Don't have an account?
          <span
            className=" mx-1 font-semibold text-sm cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => {
              setIsLogin(false);
        
            }}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
            </>
  );
};

export default Login;
