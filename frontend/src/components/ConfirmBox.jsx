
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
export default function ConfirmBox(props) {
    const {openConfirmBox,setOpenConfirmBox}=props
    const navigate = useNavigate()
    const handleLogout=(e)=>{
      setOpenConfirmBox(false); 
      localStorage.clear();
      navigate('/auth')
    }

  return (
    <>
   
      <Modal show={openConfirmBox} size="md" onClose={() => setOpenConfirmBox(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to Signout?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleLogout}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenConfirmBox(false)}>
                No, cancel
              </Button>
              
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
