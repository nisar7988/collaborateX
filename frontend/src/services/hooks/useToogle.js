import { useState } from "react";

const useToggleVideo = () => {
  const [isVideoOff, setVideoOff] = useState(false);

  const toggleVideo = (myStream) => {
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = isVideoOff;
      setVideoOff(!isVideoOff);
    }
  };

  return [isVideoOff, toggleVideo];
};

export default useToggleVideo;
