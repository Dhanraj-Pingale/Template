import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Homepage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleButtonClick = () => {
    navigate('/about'); // Navigate to the /about route when button is clicked
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Start working here...</h1>
      
      {/* Button to navigate to /about */}
      <button 
        onClick={handleButtonClick} 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Go to About Page
      </button>
    </div>
  );
};

export default Homepage;
