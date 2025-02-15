import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FiMenu, FiLogOut, FiHome, FiInfo } from "react-icons/fi";

export default function AdminDashboard() {
  const [isHovered, setIsHovered] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("company");
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    setCurrentSection(section);
    navigate(section);
    // setMobileOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    { label: "Home", section: "/admindashboard/adminhomepage", icon: <FiHome /> },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-blue-900 text-white transition-all duration-200 ease-in-out ${isHovered ? "w-56" : "w-12"} h-full flex flex-col`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          {isHovered && <h1 className="text-lg font-bold">ADMIN</h1>}
        </div>
        {/* Menu Items */}
        <nav className="flex-1">
          {menuItems.map(({ label, section, icon }) => (
            <button
              key={section}
              className={`flex items-center w-full p-3 text-left hover:bg-blue-700 transition ${
                currentSection === section ? "bg-blue-800" : ""
              }`}
              onClick={() => handleNavigation(section)}
            >
              <span className="text-xl mr-3">{icon}</span>
              {isHovered && <span>{label}</span>}
            </button>
          ))}
        </nav>
        {/* Logout Button */}
        <button
          className="flex items-center w-full p-3 text-left hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          <span className="text-xl mr-3">
            <FiLogOut />
          </span>
          {isHovered && <span>Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        {/* Content */}
        <div>{currentSection === "adminhomepage" ? <Outlet /> : <Outlet />}</div>
      </div>
    </div>
  );
}
