import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../lib/api";
import { User, Stethoscope, Eye, EyeOff } from "lucide-react";
import bgImage from "../assets/bg.png";

import doctorImage from "../assets/doc.jpeg";
import patientImage from "../assets/pat.jpeg";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
  });

  const isPatient = formData.role === "patient";
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
  bg-cover bg-center bg-no-repeat
  transition-all duration-500"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">

        {/* LEFT SIDE : IMAGE */}
        <div className="relative hidden md:block bg-black">
          <img
            src={isPatient ? patientImage : doctorImage}
            alt="Role visual"
            className="absolute inset-0 w-full h-full object-fill"
          />

          {/* subtle black overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Text */}
          <div className="relative z-10 p-10 h-full flex flex-col justify-end text-white">
            <h2 className="text-3xl font-bold mb-2">
              {isPatient ? "For Patients" : "For Doctors"}
            </h2>
            <p className="text-white/90 text-sm max-w-sm">
              {isPatient
                ? "Book appointments, consult trusted doctors, and manage your health."
                : "Manage patients, appointments, and build your medical practice."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE : FORM */}
        <div className="p-8 flex flex-col justify-center">

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Choose your role to continue
            </p>
          </div>

          {/* Role Switch */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "patient" }))
              }
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
              transition-all duration-300
              ${isPatient
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
            >
              <User size={18} />
              Patient
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, role: "doctor" }))
              }
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
              transition-all duration-300
              ${!isPatient
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
            >
              <Stethoscope size={18} />
              Doctor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border
              focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border
              focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border
    focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>


            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white
              bg-blue-600 transition-all duration-300 hover:opacity-90"
            >
              Create {isPatient ? "Patient" : "Doctor"} Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium relative group text-blue-600"
            >
              Login
              <span
                className="absolute left-0 -bottom-0.5 h-0.5 w-0
                group-hover:w-full transition-all duration-300 bg-blue-600"
              />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
