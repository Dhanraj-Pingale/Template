import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./components/authentications/ProtectedRoute";
import AuthProvider from "./context/AuthContext";
import Landingpage from "./Landingpage";

//user
import UserLogin from "./components/authentications/UserLogin";
import UserRegister from "./components/authentications/UserRegister";
import UserDashboard from "./user/UserDashboard";
import UserHomepage from "./user/pages/UserHomepage";
import About from "./user/pages/About";

//admin
import AdminLogin from "./components/authentications/AdminLogin";
import AdminRegister from "./components/authentications/AdminRegister";
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
    element: <UserLayout />,
    children: [
      { path: "about", element: <About /> },
      { path: "userhomepage", element: <UserHomepage /> },
    ],
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
