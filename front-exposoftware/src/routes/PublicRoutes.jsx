// src/routes/PublicRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
//import Contact from "../pages/Home/Contact";
import About from "../pages/Home/About";
import Home_dinamico from "../pages/Home/Home_dinamico";
import Projects from "../pages/Home/Projects";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

export default function PublicRoutes() {
  return (
    <Routes>
        {/* Página principal */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/*<Route path="/contact" element={<Contact />} />*/}
          <Route path="/home-dinamico" element={<Home_dinamico />} />
          <Route path="/projects" element={<Projects />} />

        {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

    </Routes>
  );
}
