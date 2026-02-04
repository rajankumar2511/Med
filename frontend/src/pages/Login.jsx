import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../lib/api';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      const { token, user } = result.data;

      localStorage.setItem("token", token);

      // 🚨 role must come from backend
      if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-gray-800">MediCare Connect</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am logging in as:
              </label>
              <div className="flex gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === 'patient'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`text-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'patient' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <div className="text-lg mb-1">👤</div>
                    <span className="font-medium">Patient</span>
                  </div>
                </label>

                <label className="flex-1">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={formData.role === 'doctor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`text-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.role === 'doctor' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                    <div className="text-lg mb-1">👨‍⚕️</div>
                    <span className="font-medium">Doctor</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">G</span>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">f</span>
                <span>Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>

          {/* Back to Home */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link to="/" className="text-gray-600 hover:text-gray-800 inline-flex items-center gap-1">
              <span>←</span>
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer Note */}

      </div>
    </div>
  );
};

export default Login;