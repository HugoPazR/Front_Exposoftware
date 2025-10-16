import React from "react";
import { Carousel } from "primereact/carousel"; // Carrusel de PrimeReact

export default function About() {
  
  const images = [
    "https://www.unicesar.edu.co/wp-content/uploads/2025/06/66_11zon.webp",
    "https://www.unicesar.edu.co/wp-content/uploads/2025/06/Registro-3._11zon-980x653.webp",
    "https://www.unicesar.edu.co/wp-content/uploads/2025/06/Registro-4._11zon-980x653.webp",
    "https://www.unicesar.edu.co/wp-content/uploads/2025/06/Registro-5._11zon-980x653.webp",
  ];

  // 🔧 Plantilla para renderizar cada imagen
  const imageTemplate = (image) => {
    return (
      <div className="flex justify-center items-center">
        <img
          src={image}
          alt="Evento Exposoftware"
          className="rounded-lg shadow-md w-full h-80 object-cover"
        />
      </div>
    );
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Sección principal */}
      <section className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        
        
        <div className="flex-1">
          <Carousel
            value={images}
            numVisible={1}
            numScroll={1}
            circular
            autoplayInterval={4000}
            itemTemplate={imageTemplate}
          />
        </div>

        
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-green-700 mb-4">
            Exposoftware UPC
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <span className="font-semibold text-green-700">Exposoftware </span> 
            es una iniciativa de la Universidad Popular del Cesar, creada con el propósito 
            de fomentar la creatividad, la innovación y el desarrollo de software en los 
            estudiantes del programa de Ingeniería de Sistemas.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            A través de esta plataforma, se busca visibilizar los proyectos académicos y 
            de investigación de los estudiantes, promoviendo el trabajo colaborativo, la 
            gestión del conocimiento y el fortalecimiento del talento tecnológico de la región.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Exposoftware no solo es un espacio de exposición, sino una comunidad en constante 
            evolución, comprometida con el crecimiento profesional, la innovación y la excelencia 
            académica.
          </p>
        </div>
      </section>

      {/* Sección de misión y visión */}
      <section className="bg-gray-100 py-16 px-6">
        
         <div className="container mx-auto grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 hover:border-green-200 transition-all hover:shadow-lg">
                <h2 className="text-2xl text-center font-bold text-green-700 mb-4">Misión</h2>
                <p className="text-gray-700 leading-relaxed">
                Promover el desarrollo de soluciones tecnológicas innovadoras a través del talento 
                estudiantil de la Universidad Popular del Cesar, incentivando el aprendizaje práctico 
                y la exposición de proyectos que aporten al avance del sector tecnológico de la región.
                </p>
            </div>
          
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 hover:border-green-200 transition-all hover:shadow-lg">
                <h2 className="text-2xl text-center font-bold text-green-700 mb-4">Visión</h2>
                <p className="text-gray-700 leading-relaxed">
                Ser reconocida como una plataforma de referencia nacional para la exposición, 
                colaboración y difusión de proyectos de software universitarios, destacando el 
                liderazgo tecnológico y la innovación de nuestros estudiantes.
                </p>
            </div>
        </div>
      </section>

      {/* Sección de equipo o créditos */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Equipo de Desarrollo</h2>
        <p className="text-gray-700 mb-6">
          Este proyecto fue desarrollado por estudiantes de Ingeniería de Sistemas 
          de la Universidad Popular del Cesar, con el acompañamiento de docentes 
          y coordinadores académicos.
        </p>

        <div className="flex justify-center gap-10 flex-wrap">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-60">
            <h3 className="font-semibold text-lg text-green-700">Hugo Paz Rojas</h3>
            <p className="text-gray-600 text-sm">Líder Front-end</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-60">
            <h3 className="font-semibold text-lg text-green-700">Equipo Exposoftware</h3>
            <p className="text-gray-600 text-sm">Desarrollo y Diseño</p>
          </div>
        </div>
      </section>
    </div>
  );
}
