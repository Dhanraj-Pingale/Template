import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminAuthContext = createContext();

const AdminAuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/session", { withCredentials: true })
      .then((res) => {
        console.log("Admin Context", res.data);
        if (res.data.isAdminAuthenticated && res.data.user?.isAdmin) {
          setIsAdminAuthenticated(true);
          setAdmin(res.data.user);
        } else {
          setIsAdminAuthenticated(false);
          setAdmin(null);
        }
      })
      .catch(() => {
        setIsAdminAuthenticated(false);
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/admin/adminlogin",
        { email, password },
        { withCredentials: true }
      );
  
      console.log("Login successful, updating context...", res.data);
      console.log("Admin isAdmin status:", res.data.admin?.isAdmin); // Use admin.isAdmin
  
      // Use res.data.admin for authentication check
      if (res.status === 200 && res.data.admin?.isAdmin) {
        setIsAdminAuthenticated(true);
        console.log("Admin authenticated:", res.data.admin);
        setAdmin(res.data.admin); // Store admin details
      } else {
        console.error("Admin login failed: Not authorized");
      }
    } catch (error) {
      console.error(
        "Admin login failed",
        error.response?.data || error.message
      );
    }
  };
  
  

  const adminlogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/admin/logout",
        {},
        { withCredentials: true }
      );
      setIsAdminAuthenticated(false);
      setAdmin(null);
      
    } catch (error) {
      console.error("Admin logout failed", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, admin, login, adminlogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
