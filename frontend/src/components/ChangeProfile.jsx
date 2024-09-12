import { Button, Modal } from "flowbite-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AlertComponent from "./AlertComponent";
import LoadingSpinner from "./LoadingSpinner";
import Upload from "./UploadProfile";
import logo from '../assets/collaborateX.png'
const ChnageProfile = (props) => {
  const { profilePic } = props;
  const { showChangeProfile, setShowChangeProfile } = props;
  const [showAlert, setShowAlert] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleRemove = async () => {
    let userId = localStorage.getItem("id");
    try {
      const response = await axios.put("https://collaboratex.onrender.com/api/update/remove-pic", {
        userId: userId,
      });
      if (response.status === 201) {
        const { _id, ...rest } = response.data.user;
        localStorage.setItem("id", _id);
        localStorage.setItem("user", JSON.stringify(rest));
        setLoading(false);
        setShowAlert(true);
        setOpenModal(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
      } else {
        console.error("Failed to removed picture.");
      }
    } catch (err) {
      console.error("Error removing picture:", err);
    }
  };
  console.log(profilePic);

  return (
    <>
      <Upload openModal={openModal} setOpenModal={setOpenModal} />
      <Modal
        dismissible
        show={showChangeProfile}
        onClose={() => setShowChangeProfile(false)}
      >
        <Modal.Header className="h-3 relative">
          <img src={logo} className="w-1/5 absolute top-0 " alt='logo' />
        </Modal.Header>
        <Modal.Body className="rounded-full">
          <div className="flex  justify-center">
            <div className="border rounded-md m-auto border-slate-900 p-10 shadow-md shadow-slate-900">
              <img
                className="w-62 h-60 rounded-full"
                src={profilePic}
                alt="Selected file preview"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setOpenModal(true);
              setShowChangeProfile(false);
            }}
          >
            change
          </Button>
          <button
            className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-600"
            onClick={handleRemove}
          >
            Remove
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ChnageProfile;
