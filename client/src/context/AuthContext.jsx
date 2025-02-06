import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session status on page load
    axios
      .get("http://localhost:3000/auth/session", { withCredentials: true })
      .then((res) => {
        if (res.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // Set loading to false once the check is complete
      });
  }, []); // Empty dependency array ensures it runs once when the component mounts

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/logindb",
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Login failed", error);
      // Optionally, add feedback to user (e.g., a login error state)
    }
  };

  const logout = async () => {
    try {
      // Clear session on the server
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });

      // Clear authentication data on the client
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("isAuthenticated");

      // Optionally, redirect user after logout (for example to home page)
      // navigate('/'); // If using react-router
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // If loading, show nothing or a loader. You can customize this based on your UI.
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
