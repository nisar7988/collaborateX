import React, { createContext, useContext, useState } from 'react';

// Create a context
const MediaStreamContext = createContext();

// Provide the context
export const MediaStreamProvider = ({ children }) => {
  const [mediaStreams, setMediaStreams] = useState({});

  const addStream = (streamId, stream) => {
    console.log('addstream runs')
    setMediaStreams(prev => ({ ...prev, [streamId]: stream }));

  };
console.log(mediaStreams)
  const removeStream = (streamId) => {
    console.log('remotestream runs')
    setMediaStreams(prev => {
      const newStreams = { ...prev };
      delete newStreams[streamId];
      return newStreams;
    });
  };

  return (
    <MediaStreamContext.Provider value={{ mediaStreams, addStream, removeStream }}>
      {children}
    </MediaStreamContext.Provider>
  );
};

// Use the context
export const useMediaStreams = () => {
  return useContext(MediaStreamContext);
};
