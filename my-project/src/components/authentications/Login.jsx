import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/logindb", { email, password })
      .then((result) => {
        console.log(result);
        // Check if the login was successful
        if (result.data === "Success") {
          navigate("/"); // Navigate to home on success
        } else {
          setError(result.data); // Set error message if not successful
        }
      })
      .catch((err) => {
        console.error(err); // Use console.error for better logging
        setError("Login failed. Please try again."); // Generic error message
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold mb-6">Login Form</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          autoComplete="off"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          autoComplete="off"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
