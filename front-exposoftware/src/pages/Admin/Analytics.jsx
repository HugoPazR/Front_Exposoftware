import React, { useState } from 'react';
import PowerBIEmbed from '../../components/PowerBI/PowerBIEmbed';
import { openPowerBIReport } from '../../Services/PowerBIService';
import { POWER_BI_CONFIG } from '../../utils/constants';

/**
 * Página de Analytics/Reportes con Power BI
 * 
 * Muestra específicamente:
 * 1. Total de proyectos (Recuento de id_proyecto por Column1.nombre_linea)
 * 2. Suma de calificación por tipo de actividad
 */
const Analytics = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header de la página */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Analytics & Reportes
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Visualiza estadísticas y análisis de los proyectos de ExpoSoftware
              </p>
            </div>
            
            {/* Botón de acción rápida */}
            <button
              onClick={() => openPowerBIReport()}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
              Abrir Reporte Completo
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjetas de estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon="📊"
            title="Total Proyectos"
            value="7"
            subtitle="Registrados en el sistema"
            color="blue"
          />
          <StatCard
            icon="📈"
            title="Calificación Total"
            value="10"
            subtitle="Suma de todas las calificaciones"
            color="green"
          />
          <StatCard
            icon="🎯"
            title="Tipos de Actividad"
            value="1"
            subtitle="Exposoftware"
            color="purple"
          />
        </div>

        {/* Controles de visualización */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showFilters"
                checked={showFilters}
                onChange={(e) => setShowFilters(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showFilters" className="text-sm text-gray-700">
                Mostrar panel de filtros
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showNavigation"
                checked={showNavigation}
                onChange={(e) => setShowNavigation(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showNavigation" className="text-sm text-gray-700">
                Mostrar navegación de páginas
              </label>
            </div>

            <div className="ml-auto text-xs text-gray-500">
              ⚙️ Personaliza la vista del reporte
            </div>
          </div>
        </div>

        {/* Descripción de las gráficas */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">
                Gráficas Principales del Dashboard
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Este dashboard muestra las métricas más importantes de los proyectos de ExpoSoftware:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border border-blue-100">
                  <span className="font-semibold text-blue-700">📊 Total de Proyectos</span>
                  <p className="text-gray-600 text-xs mt-1">
                    Recuento de proyectos por línea de investigación
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-blue-100">
                  <span className="font-semibold text-blue-700">📈 Suma de Calificaciones</span>
                  <p className="text-gray-600 text-xs mt-1">
                    Total de calificaciones agrupadas por tipo de actividad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reporte de Power BI */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M2 2h4v20H2V2zm6 4h4v16H8V6zm6-4h4v20h-4V2zm6 8h4v12h-4V10z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Dashboard de Proyectos ExpoSoftware
                </h2>
                <p className="text-sm text-blue-100">
                  Análisis interactivo en tiempo real
                </p>
              </div>
            </div>
          </div>

          {/* Componente Power BI Embed */}
          <div className="p-4 bg-gray-50">
            <PowerBIEmbed
              pageId={POWER_BI_CONFIG.PAGE_ID}
              showFilters={showFilters}
              showPageNavigation={showNavigation}
              height="800px"
            />
          </div>

          {/* Footer del reporte */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  <span className="font-semibold">📊</span> Powered by Microsoft Power BI
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  <span className="font-semibold">🔄</span> Actualizado: {new Date().toLocaleDateString('es-ES')}
                </span>
              </div>
              <button
                onClick={() => openPowerBIReport()}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Ver reporte completo
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sección de métricas detalladas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Métricas de Proyectos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Distribución de Proyectos
            </h3>
            <div className="space-y-3">
              <MetricItem
                label="Tecnologías de..."
                value="~50%"
                icon="💻"
                color="blue"
              />
              <MetricItem
                label="Transformación..."
                value="~50%"
                icon="🔄"
                color="purple"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                📌 Distribución por líneas de investigación
              </p>
            </div>
          </div>

          {/* Card: Métricas de Calificaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Análisis de Calificaciones
            </h3>
            <div className="space-y-3">
              <MetricItem
                label="Suma Total"
                value="10"
                icon="📊"
                color="green"
              />
              <MetricItem
                label="Tipo de Actividad"
                value="Exposoftware"
                icon="🎯"
                color="yellow"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                📌 Total acumulado por categoría
              </p>
            </div>
          </div>
        </div>

        {/* Footer con ayuda */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-2">
                💡 Consejos para usar el Dashboard
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Interactúa:</strong> Haz clic en cualquier gráfico para filtrar los datos relacionados</li>
                <li>• <strong>Filtros:</strong> Usa el panel de filtros lateral para refinar tu análisis</li>
                <li>• <strong>Detalles:</strong> Pasa el cursor sobre los elementos para ver información adicional</li>
                <li>• <strong>Reporte completo:</strong> Haz clic en "Abrir Reporte Completo" para ver todas las visualizaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para tarjetas de estadísticas
const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`text-4xl bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg shadow-lg`}>
          <span className="drop-shadow">{icon}</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

// Componente auxiliar para items de métricas
const MetricItem = ({ label, value, icon, color = 'gray' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    gray: 'bg-gray-50 border-gray-200'
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
};

export default Analytics;
