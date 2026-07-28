import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  CalendarDays,
  Stethoscope,
  User,
  Home,
  Phone,
  Heart,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { getAuthUser } from "../lib/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Reset scroll & navbar size on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await getAuthUser();
      setUser(authUser);
    };
    fetchUser();
  }, [location]);

  const getHomePath = () => {
    if (user?.role === "doctor") return "/doctor-dashboard";
    return "/";
  };

  const handleBookAppointment = () => {
    setMobileOpen(false);
    if (user) navigate("/doctors/all");
    else navigate("/login", { state: { from: location.pathname } });
  };

  const linkStyle = ({ isActive }) =>
    `px-5 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center gap-2
     ${isActive
      ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
      : "text-gray-800 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const navLinks = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/doctors/all", label: "Doctors", icon: <Stethoscope size={20} /> },
    { path: "/services", label: "Services", icon: <Heart size={20} /> },
    { path: "/about", label: "About", icon: <Shield size={20} /> },
    { path: "/contact", label: "Contact", icon: <Phone size={20} /> },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-white py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink to={getHomePath()} className="flex items-center">
              <img
                src={logo}
                alt="MediSlot Logo"
                className={`rounded-xl object-contain transition-all duration-300 ${scrolled ? "h-12 w-12" : "h-14 w-14"
                  }`}
              />
              <h1
                className={`ml-3 font-bold text-blue-800 ${scrolled ? "text-xl" : "text-2xl"
                  }`}
              >
                MediSlot
              </h1>
            </NavLink>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={linkStyle}>
                  {link.icon}
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <NavLink
                  to="/my-appointments"
                  className="flex items-center gap-2 px-4 py-2.5 text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  <User size={18} />
                  Appointments
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-4 py-2.5 text-blue-700 hover:bg-blue-50 rounded-lg"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-4 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}

              <button
                onClick={handleBookAppointment}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                <CalendarDays size={20} />
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-blue-700"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white shadow-md px-4 py-6 space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={linkStyle}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}

            <button
              onClick={handleBookAppointment}
              className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              <CalendarDays size={20} />
              Book Appointment
            </button>
          </div>
        )}
      </nav>

      {/* Scroll Indicator */}
      {scrolled && (
        <div className="fixed top-0 left-0 right-0 h-1 z-40 bg-gradient-to-r from-blue-500 to-emerald-500" />
      )}

      {/* Spacer */}
      <div className={scrolled ? "h-20" : "h-24"} />
    </>
  );
};

export default Navbar;
