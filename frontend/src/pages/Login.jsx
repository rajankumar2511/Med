import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import { toast } from "react-toastify";
import { Eye, EyeOff, User, Stethoscope, Lock } from "lucide-react";
import bgImage from "../assets/bg.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const [showPassword, setShowPassword] = useState(false);
  const isPatient = formData.role === "patient";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      const { token, user } = result.data;
      localStorage.setItem("token", token);

      if (user.role === "doctor") navigate("/doctor-dashboard");
      else navigate("/patient-dashboard");
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
  bg-cover bg-center bg-no-repeat
  transition-all duration-500"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Top Accent */}
        <div className="h-2 bg-blue-600" />

        <div className="p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Lock size={22} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Log in to your account
            </p>
          </div>

          {/* Role Switch (lighter than signup) */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, role: "patient" }))}
              className={`flex-1 h-12 rounded-lg text-lg font-medium
flex items-center justify-center gap-2
transition-all

              ${isPatient
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
            >
              <User size={16} />
              Patient
            </button>

            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, role: "doctor" }))}
              className={`flex-1 h-12 rounded-lg text-lg font-medium
flex items-center justify-center gap-2
transition-all


              ${!isPatient
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
            >
              <Stethoscope size={16} />
              Doctor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Password with toggle */}
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
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white
              bg-blue-600 hover:opacity-90 transition-all"
            >
              Log In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            New to MediSlot?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Create an account
            </Link>
          </p>

          <div className="text-center mt-5">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
