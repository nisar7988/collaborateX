  import React, { useState } from "react";
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
  import logo from "../assets/collaborateX.png";
  import AlertComponent from "./AlertComponent";

  const Signup = (props) => {
    const [colorAlert,setColorAlert] = useState("")
    const [colorText,setColorText] = useState("")
    const [showAlert,setShowAlert]=useState(false)
    const { setIsLogin } = props;
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Define loading state
    const navigate = useNavigate();

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      let error = "";
      switch (name) {
        case "name":
          error = value.trim() ? "" : "Name is required.";
          break;
        case "username":
          error = value.trim() ? "" : "Username is required.";
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          error = emailRegex.test(value) ? "" : "Please enter a valid email address.";
          break;
        case "password":
          error = value ? (value.length < 6 ? "Password must be at least 6 characters." : "") : "Password is required.";
          break;
        case "confirmPassword":
          error = value === formData.password ? "" : "Passwords do not match.";
          break;
        default:
          break;
      }

      setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Final validation check
    if (Object.values(errors).some(error => error !== "") || Object.values(formData).some(field => field === "")) {
        setColorAlert("failure");
        setColorText("Please fill in all fields correctly.");
        setShowAlert(true);
        setLoading(false);
        return;
    }

    if (formData.password === formData.confirmPassword) {
      try {
        const { confirmPassword, ...datatosend } = formData;
        const response = await axios.post('https://collaboratex.onrender.com/api/auth/signup', datatosend);
        if (response.status === 201) {
          setOtpSent(false);
        } else if (response.status === 200) {
          setOtpSent(true);
        }
      } catch (error) {
        if(error.response.status ===400){
          setColorText('user already exist');
          setColorAlert("failure");
        }
        else{
        console.error("Signup error: ", error); // Log error
        setColorAlert("failure");
        setColorText("Failed to send OTP!");
        }
      }
    } else {
      setColorAlert("failure");
      setColorText("Passwords do not match! Try Again");
      setShowAlert(true);
    }
    setLoading(false);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false)
    }, 1000);
};

const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const { email, name, password, username } = formData;
      const res = await axios.post('https://collaboratex.onrender.com/api/auth/verify-otp', {
        email,
        otp,
        password,
        username,
        name
      });
        console.log(res.data.user);
        const { _id, ...rest } = res.data.user;
        console.log(_id);
        console.log(rest); // The rest of the data without _id
        localStorage.setItem("user", JSON.stringify(rest));
        localStorage.setItem("id", JSON.stringify(_id));
      setColorAlert("success");
      setColorText("User Registered Successfully.");
      setShowAlert(true);
      setTimeout(() => {
        setOtpSent(false);
        setIsLogin(true);
        setShowAlert(false);
        navigate('/'); 
      }, 1000);
    } catch (error) {
      console.error("OTP verification error: ", error); 
      setColorAlert("failure");
      setColorText("Invalid OTP!");
      setShowAlert(true);
    }
    setLoading(false);
};

    return (
      <>
      {showAlert && <AlertComponent color={colorAlert} text={colorText}/>}
      <div className="p-8 rounded shadow-md bg-white w-96   ">
            {otpSent ? (
          <>
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                value={otp}
                name="otp"
                id="otp"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-cyan-600 focus:border-cyan-500 focus:outline-none focus:ring-0"
                placeholder=" "
                required
              />
              <label
                htmlFor="otp"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Enter OTP
              </label>
            </div>
            <button onClick={handleVerifyOtp} className='shadow-sm hover:bg-sky-900 text-md hover:text-white rounded-md px-6 py-1 border-2 border-sky-700' type='button'>
              Verify OTP
            </button>
            </>
        ) : (
      <>
        <div className="text-center mb-6">
          <img src={logo} alt="logo" className="w-24 mx-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'username', 'email', 'password', 'confirmPassword'].map((field, index) => (
            <div key={index} className="relative border-b-2 mb-3 border-cyan-700 z-0 w-full group">
              <input
                type={field.includes('password') || field.includes('confirmPassword') ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                id={field}
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
                value={formData[field]}
                onChange={handleChange}
                required
              />
              <label
                htmlFor={field}
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              {errors[field] && (
                <p className="text-red-500 text-xs mt-2">{errors[field]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={
              !!errors.name ||
              !!errors.username ||
              !!errors.email ||
              !!errors.password ||
              !!errors.confirmPassword
            }
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <p>
            Have an account?{" "}
            <span
              className="cursor-pointer text-blue-700 font-bold"
              onClick={() => {
                setIsLogin(true);
              }}
            >
              Sign In
            </span>
          </p>
        </form>
        </>
        )}
      </div>
      </>
            
    );
  };

  export default Signup;
