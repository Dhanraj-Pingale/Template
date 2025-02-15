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
        console.log("User Context", res.data);
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
  }, []);

  const login = async (email, password) => {
    try {
      console.log("login function called");
      const res = await axios.post(
        "http://localhost:3000/auth/logindb",
        { email, password },
        { withCredentials: true }
      );

      console.log("Response from /logindb:", res.data);

      if (res.status === 200) {
        setIsAuthenticated(true);
        setUser(res.data.user);
        console.log("User authenticated:", res.data.user);
      } else {
        console.error("Login failed: Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
    }
  };


  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true }
      );
  
      setIsAuthenticated(false);
      setUser(null);
  
      // Ensure React detects changes
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
