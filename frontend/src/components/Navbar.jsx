import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/collaborateX.png';
import ConfirmBox from './ConfirmBox';
import defaultIMG from '../assets/user.png'; // Default image to use initially
import axios from 'axios';

import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  useEffect(()=>{
    if (!localStorage.getItem("id")) {
      navigate("/auth");
    }
  },[])
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const navigate = useNavigate();
const [user,setUser] = useState({})
  const [profilePic,setProfilePic] = useState(null)
  useEffect(() => {
   const pic =JSON.parse(localStorage.getItem("user"));
   setUser(pic);
   setProfilePic(pic.profilePicture);

  }, []);

  useEffect(() => {
    return () => {
      if (profilePic !== defaultIMG) {
        URL.revokeObjectURL(profilePic);
      }
    };
  }, [profilePic]);

  return (
    <div>
      <ConfirmBox openConfirmBox={openConfirmBox} setOpenConfirmBox={setOpenConfirmBox} />
      <Navbar className="" fluid>
        <NavbarBrand to="/">
          <img
            src={logo}
            className="mr-3 w-[10rem] h-[5rem] rounded-full object-cover sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white"></span>
        </NavbarBrand>
        <div className="flex md:order-2 mx-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={profilePic ? profilePic :defaultIMG }
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
               {user.email}
              </span>
            </DropdownHeader>
            <DropdownItem onClick={() => navigate('/profile')}>Profile</DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={() => setOpenConfirmBox(true)}>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink as={Link} to="/" active>
            Home
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
