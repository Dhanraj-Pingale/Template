import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/authentications/Login";
import Register from "./components/authentications/Register";
import Homepage from "./components/homepages/Homepage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/" element={<Homepage></Homepage>}></Route>

        {/* Guys u can add your routes here... */}





      </Routes>
    </BrowserRouter>
  );
};

export default App;
