import { Navigate } from 'react-router-dom';
import * as AuthService from '../Services/AuthService';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('❌ Usuario no autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole && userRole !== requiredRole) {
    console.log(`❌ Rol incorrecto. Esperado: ${requiredRole}, Actual: ${userRole}`);
    
    // Redirigir al dashboard correcto según el rol
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dash" replace />;
      case 'docente':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'estudiante':
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // Usuario autenticado y con el rol correcto
  return children;
};

/**
 * Componente para proteger rutas de admin
 */
export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

/**
 * Componente para proteger rutas de docente
 */
export const DocenteRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="docente">{children}</ProtectedRoute>;
};

/**
 * Componente para proteger rutas de estudiante
 */
export const EstudianteRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="estudiante">{children}</ProtectedRoute>;
};
