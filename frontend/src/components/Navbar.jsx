import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/collaborateX.png";
import ConfirmBox from "./ConfirmBox";
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
} from "flowbite-react";
import { Link } from "react-router-dom";
const NavigationBar = () => {
  const navigate=useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <ConfirmBox openModal={openModal} setOpenModal={setOpenModal}/>
      <Navbar className="" fluid>
        <NavbarBrand to="/">
          <img
            src={logo}
            className="mr-3 w-[10rem] h-[5rem] rounded-full object-cover  sm:h-9"
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
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@example.com
              </span>
            </DropdownHeader>
            <DropdownItem onClick={()=>{navigate('/profile')}}>Profile</DropdownItem>
  
            <DropdownDivider />
            <DropdownItem onClick={() => setOpenModal(true)} >Sign out</DropdownItem>
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
