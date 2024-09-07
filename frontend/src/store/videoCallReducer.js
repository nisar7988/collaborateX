import { createSlice } from '@reduxjs/toolkit';

const videoCallSlice = createSlice({
  name: 'videoCall',
  initialState: {
    remoteStreams: {},  // Changed from Map to a plain object
    isAudio: true,
    isVideo: true,
  },
  reducers: {
    ADD_REMOTE_STREAM(state, action) {
      const { streamId, stream } = action.payload;
      console.log(streamId,stream)
      state.remoteStreams = { ...state.remoteStreams, [streamId]: stream }; 
    },
    REMOVE_REMOTE_STREAM(state, action) {
      const { streamId } = action.payload;
      const { [streamId]: removedStream, ...remainingStreams } = state.remoteStreams;
      state.remoteStreams = remainingStreams; 
    },
    TOGGLE_AUDIO(state) {
      state.isAudio = !state.isAudio;
    },
    TOGGLE_VIDEO(state) {
      state.isVideo = !state.isVideo;
    },
  },
});

export const { ADD_REMOTE_STREAM, REMOVE_REMOTE_STREAM, TOGGLE_AUDIO, TOGGLE_VIDEO } = videoCallSlice.actions;
export default videoCallSlice.reducer;
