import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Correct import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/logindb", {
        email,
        password,
      });

      // Set message and user from the response
      setMessage(response.data.message);
      setUser(response.data.user);

      // Navigate to home after login
      navigate("/"); // Navigate to the home page
    } catch (error) {
      console.error("Login error", error);
      setMessage("Login failed");
      setUser(null); // Clear user on login failure
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Display message */}
        {message && (
          <p className={`mt-4 text-center ${user ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* Conditionally render user info if available */}
        {user && (
          <div className="mt-4 text-center">
            <p className="text-lg">Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
