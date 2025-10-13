import { Link } from "react-router-dom";
import { Button } from "primereact/button";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Contenido izquierdo */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-green-600 leading-tight">
                XI Jornada de Investigación EXPOSOFTWARE
              </h1>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Universidad Popular del Cesar
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                ¡Bienvenidos a la fiesta del conocimiento y la innovación! Un espacio donde la creatividad de nuestros estudiantes y docentes cobra vida a través de proyectos de software que marcan la diferencia. Prepárense para explorar, aprender e inspirarse.
              </p>
              
              {/* Botones de acción */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/upload">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                    <i className="pi pi-upload"></i>
                    Subir Proyecto
                  </button>
                </Link>
                
                <Link to="/proyectos-anteriores">
                  <button className="bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                    <i className="pi pi-eye"></i>
                    Ver Proyectos Anteriores
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Imagen/Ilustración derecha */}
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="relative w-full max-w-md aspect-square">
                {/* Efecto de fondo difuminado */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-purple-400 to-blue-400 rounded-full opacity-60 blur-3xl"></div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Sección adicional - Características */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-lightbulb text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Innovación</h3>
              <p className="text-gray-600">
                Proyectos que transforman ideas en soluciones tecnológicas reales
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-users text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Colaboración</h3>
              <p className="text-gray-600">
                Espacio de encuentro entre estudiantes, docentes e industria
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="pi pi-star text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Excelencia</h3>
              <p className="text-gray-600">
                Reconocimiento al talento y esfuerzo de nuestra comunidad académica
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}