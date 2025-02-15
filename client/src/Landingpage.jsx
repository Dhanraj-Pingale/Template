import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Assuming AuthContext is in this location
import { AdminAuthContext } from "./context/AdminContext"; // Assuming AdminAuthContext is in this location

const Landingpage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isAdminAuthenticated } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/userdashboard/userhomepage"); // Redirect to user homepage if already authenticated
    }

  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate("/admindashboard/adminhomepage"); // Redirect to admin homepage if already authenticated
    }

  }, [isAdminAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-gray-600 mb-6">Choose an option to proceed:</p>

        <div className="grid grid-cols-2 gap-4">
          <NavLink
            to="/adminlogin"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Admin Login
          </NavLink>
          <NavLink
            to="/adminregister"
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Admin Register
          </NavLink>
          <NavLink
            to="/userlogin"
            className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
          >
            User Login
          </NavLink>
          <NavLink
            to="/userregister"
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
          >
            User Register
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
