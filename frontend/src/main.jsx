import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SocketProvider } from './context/SocketProvider.jsx';
import { MediaStreamProvider } from './context/mediaStreamProvider.jsx';
// import { Provider } from 'react-redux';
// import store from './store/store.js';
ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <MediaStreamProvider>
      <App />
   </MediaStreamProvider>
   
  </SocketProvider>
  // </React.StrictMode>,
);
