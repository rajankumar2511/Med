import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/Myprofile";
import MyAppointments from "./pages/MyAppointments";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import DoctorDetails from "./pages/Doctorsdetail";
import BookAppointment from "./pages/BookAppointment";
import Speciality from "./pages/Speciality"; // ✅ ADD THIS

const App = () => {
  useEffect(() => {
  const storedLocation = sessionStorage.getItem("userLocation");

  if (!storedLocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        };

        sessionStorage.setItem(
          "userLocation",
          JSON.stringify(locationData)
        );

        console.log("Location saved:", locationData);
      },
      (error) => {
        console.error("Location denied or error:", error);
      }
    );
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Doctors */}
          <Route path="/doctors" element={<Navigate to="/doctors/all" />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />

          {/* Appointment */}
          <Route path="/book-appointment/:id" element={<BookAppointment />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* User */}
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />

          {/* Static */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/speciality" element={<Speciality />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
