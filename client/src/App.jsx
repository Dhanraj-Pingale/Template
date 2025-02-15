import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./authentications/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import AdminAuthProvider from "./context/AdminContext";
import Landingpage from "./Landingpage";

//user
import UserLogin from "./authentications/UserLogin";
import UserRegister from "./authentications/UserRegister";
import UserDashboard from "./user/UserDashboard";
import UserHomepage from "./user/pages/UserHomepage";
import About from "./user/pages/About";

//admin
import AdminLogin from "./authentications/AdminLogin";
import AdminRegister from "./authentications/AdminRegister";
import AdminDashboard from "./admin/AdminDashboard";
import AdminHomepage from "./admin/pages/AdminHomepage";

const AdminLayout = () => (
  <div>
    <AdminDashboard />
  </div>
);

const UserLayout = () => (
  <div>
    <UserDashboard />
  </div>
);

const router = createBrowserRouter([
  { path: "/userlogin", element: <UserLogin /> },
  { path: "/userregister", element: <UserRegister /> },
  { path: "/adminlogin", element: <AdminLogin /> },
  { path: "/adminregister", element: <AdminRegister /> },
  { path: "/", element: <Landingpage /> },

  {
    path: "/admindashboard",
    element: <AdminLayout />,
    children: [{ path: "adminhomepage", element: <AdminHomepage /> }],
  },

  {
    path: "/userdashboard",
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "about", element: <About /> },
      { path: "userhomepage", element: <UserHomepage /> },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <AdminAuthProvider>
      <RouterProvider router={router} />
      </AdminAuthProvider>
    </AuthProvider>
  );
};

export default App;
