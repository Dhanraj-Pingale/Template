import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const UserHomepage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleButtonClick = () => {
    navigate("/userdashboard/about"); // Navigate to the /about route when button is clicked
  };

  const logoutPressed = async () => {
    await axios.post(
      "http://localhost:3000/auth/logout",
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("isAuthenticated");

    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4 text-black">
        Start working here...
      </h1>

      {/* Button to navigate to /about */}
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Go to About Page
      </button>
      <button
        onClick={logoutPressed}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default UserHomepage;
