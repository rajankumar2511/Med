import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DoctorProvider } from "./context/DoctorContext";

import "leaflet/dist/leaflet.css";
import "./services/leafletFix";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DoctorProvider>
        <App />
      </DoctorProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      /> 
    </BrowserRouter>
  </StrictMode>
);
