import { Button, Modal } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import AlertComponent from "./AlertComponent";
import loadProfilePicture from "../services/hooks/getProfilePIcture";
import LoadingSpinner from "./LoadingSpinner";
const Upload = (props) => {
  const [alertText,setAlertText] = useState('')
  const [alertColor, setAlertColor] = useState('');
  const [loading, setLoading] = useState(false);
  const { openModal, setOpenModal } = props;
  const [showAlert, setShowAlert] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload = async () => {
    console.log("handleUpload runms");
    if (!file) {
      console.log("No file selected.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    let userName = JSON.parse(localStorage.getItem("user"))["username"];
    formData.append("userName", userName);
    console.log(formData.values());

    try {
      const response = await axios.post("/api/post/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setLoading(false);
        console.log(response.data);
        const {_id,...rest} = response.data.user;
     localStorage.setItem("id",_id)
        localStorage.setItem("user", JSON.stringify(rest));
        setShowAlert(true);
        setOpenModal(false);
        setAlertText(response.data.message);
        setAlertColor('success');
        setTimeout(() => {
          setShowAlert(false);
        }, 1000);
        setFile(null);
        setFileUrl(null);
      } else {
        setAlertColor('failutre')
        setAlertText('failed to upload file')
        console.error("Failed to upload file.");
      }
    } catch (err) {
      setAlertColor('failure')
      setAlertText(err)
      console.error("Error uploading file:", err);
    }
  };




  
  const handleChange = (file) => {
    setFile(file);
    setFileUrl(URL.createObjectURL(file));
  };

  return (
    <>
      {showAlert && (
        <AlertComponent color="success" text="File uploaded successfully." />
      )}
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Upload Profile Picture</Modal.Header>
        <Modal.Body className="rounded-full">
          <div className="flex  justify-center">
        {  loading ?
          <LoadingSpinner text="uploading" />:(
            <div className="border rounded-md m-auto border-slate-900 p-10 shadow-md shadow-slate-900">
              {file ? (
                <img
                  className="w-62 h-60 rounded-full"
                  src={fileUrl}
                  alt="Selected file preview"
                />
              ) : (
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={["png", "jpg", "jpeg"]}
                />
              )}
            </div>
          )
        }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpload}>Upload</Button>
          <Button
            color="gray"
            onClick={() => {
              setOpenModal(false);
              setFile("");
              setFileUrl(null);
            }}
          >
            Cancel
          </Button>
        
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Upload;
