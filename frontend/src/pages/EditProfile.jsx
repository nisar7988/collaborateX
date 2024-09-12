import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertComponent from "../components/AlertComponent";
import NavigationBar from "../components/Navbar";

const EditProfile = () => {
  let userId = localStorage.getItem('id');
   userId = userId.replace(/"/g, '');
   console.log(userId)
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [colorAlert, setColorAlert] = useState("");
  const [colorText, setColorText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const bioRef = useRef(null);

  useEffect(() => {
    
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    let error = "";
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    } else {
      error = "";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleBioChange = (e) => {
    handleChange(e);

    bioRef.current.style.height = "auto";
    bioRef.current.style.height = `${bioRef.current.scrollHeight}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("https://collaboratex.onrender.com/api/update/profile", {profile,userId});
      if (res.status === 201) {
     const {_id,...rest} = res.data;
     localStorage.setItem("id",_id)
        localStorage.setItem("user", JSON.stringify(rest));
        setColorAlert("success");
        setColorText("Profile updated successfully!");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (err) {
      console.log(err)
      setColorAlert("failure");
      setColorText("Failed to update profile. Try again.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1300);
    }
  };

  return (
    <>
    <NavigationBar/>
      {showAlert && <AlertComponent color={colorAlert} text={colorText} />}
      <div className="p-8 rounded shadow-lg border-cyan-700 border-1 bg-white w-1/2 translate-x-1/2 translate-y-[10vh">
        <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(profile).map((field) => (
            field === "bio" ? (
              <div key={field} className="relative border-b-2 mb-3 border-cyan-700 z-0 w-full group">
                <textarea
                  name={field}
                  id={field}
                  value={profile[field]}
                  onChange={handleBioChange}
                  ref={bioRef}
                  className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="1" // Initial height
                />
                <label
                  htmlFor={field}
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Bio
                </label>
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-2">{errors[field]}</p>
                )}
              </div>
            ) : (
              <div key={field} className="relative border-b-2 mb-3 border-cyan-700 z-0 w-full group">
                <input
                  type="text"
                  name={field}
                  id={field}
                  value={profile[field]}
                  onChange={handleChange}
                  className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor={field}
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-2">{errors[field]}</p>
                )}
              </div>
            )
          ))}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 w-full mb-2"
              disabled={Object.values(errors).some((error) => error)}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
