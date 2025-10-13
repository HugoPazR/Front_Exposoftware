import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home/Home";
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Ruta principal - Home */}
          <Route path="/" element={<Home />} />
          
          {/* Redirección de /home a / */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          
          {/* Otras rutas */}
          <Route path="/projects" element={<div className="container mx-auto px-8 py-16">Página de Proyectos (Por crear)</div>} />
          <Route path="/about" element={<div className="container mx-auto px-8 py-16">Página Acerca de (Por crear)</div>} />
          <Route path="/login" element={<div className="container mx-auto px-8 py-16">Página Login (Por crear)</div>} />
          <Route path="/upload" element={<div className="container mx-auto px-8 py-16">Subir Proyecto (Por crear)</div>} />
          <Route path="/proyectos-anteriores" element={<div className="container mx-auto px-8 py-16">Proyectos Anteriores (Por crear)</div>} />
          
          {/* Ruta 404 - Página no encontrada */}
          <Route path="*" element={<div className="container mx-auto px-8 py-16 text-center"><h1 className="text-3xl font-bold text-gray-800">404 - Página no encontrada</h1></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;