import { configureStore } from '@reduxjs/toolkit';
import videoCallReducer from './videoCallReducer'; 
const store = configureStore({
  reducer: {
    videoCall: videoCallReducer,
  }
});
export default store;
