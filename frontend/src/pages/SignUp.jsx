import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signup } from '../lib/api';
const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("FORM DATA:", formData);
      console.log("TOKEN:", localStorage.getItem("token"));

      await signup(formData);  // 🔥 API call
      console.log("Profile saved:", formData);
      navigate("/");              // ✅ navigate after success
    } catch (error) {
      console.error("Profile update failed", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4 py-12">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Section */}
          <div className="lg:pr-12">
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <span className="text-2xl">←</span>
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-100 rounded-full opacity-50"></div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6 relative z-10">
                Join Our
                <span className="block text-blue-600 mt-2">Healthcare Community</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're seeking care or providing it, join thousands who trust us with their healthcare journey.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl text-blue-600">👨‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">For Patients</h3>
                    <p className="text-gray-600">Book appointments, track health records, and connect with trusted doctors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl text-green-600">🏥</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">For Doctors</h3>
                    <p className="text-gray-600">Manage appointments, expand your practice, and provide quality care.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-blue-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Secure & Confidential</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Your health data is protected with enterprise-grade security and HIPAA compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-4">
                <span className="text-lg">✨</span>
                <p className="font-medium">Create Your Account</p>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Start Your Journey
              </h2>
              <p className="text-gray-600">
                Fill in your details to create your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">👤</span>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">✉️</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Create a strong password"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 8 characters with letters and numbers
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  I am signing up as a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`relative ${formData.role === 'patient' ? 'ring-2 ring-blue-500' : ''}`}>
                    <input
                      type="radio"
                      id="patient"
                      name="role"
                      value="patient"
                      checked={formData.role === 'patient'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="patient"
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.role === 'patient' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'}`}
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <span className="font-semibold text-gray-800">Patient</span>
                      <span className="text-sm text-gray-600 mt-1">Seeking care</span>
                    </label>
                    {formData.role === 'patient' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <div className={`relative ${formData.role === 'doctor' ? 'ring-2 ring-blue-500' : ''}`}>
                    <input
                      type="radio"
                      id="doctor"
                      name="role"
                      value="doctor"
                      checked={formData.role === 'doctor'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="doctor"
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.role === 'doctor' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-25'}`}
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🏥</span>
                      </div>
                      <span className="font-semibold text-gray-800">Doctor</span>
                      <span className="text-sm text-gray-600 mt-1">Providing care</span>
                    </label>
                    {formData.role === 'doctor' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Create Account
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-lg">G</span>
                <span className="font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-lg">f</span>
                <span className="font-medium">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;