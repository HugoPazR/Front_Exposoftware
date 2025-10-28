import API from './axiosConfig';
import { eventosService } from '../services/eventosService';

export const crearEvento = async (eventoData) => {
  try {
    // Primero guardamos en localStorage
    await eventosService.crearEvento(eventoData);
    
    // Luego enviamos al backend
    const { data } = await API.post('/admin/eventos', eventoData);
    return data;
  } catch (error) {
    console.error('Error al crear el evento:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerEventos = async () => {
  try {
    const { data } = await API.get('/admin/eventos');
    return data;
  } catch (error) {
    console.error('Error al obtener eventos:', error.response?.data || error.message);
    // Si falla la API, devolvemos los datos del localStorage
    return eventosService.getEventos();
  }
};

export const obtenerEventoPorId = async (id) => {
  try {
    const { data } = await API.get(`/admin/eventos/${id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener evento:', error.response?.data || error.message);
    // Si falla la API, devolvemos los datos del localStorage
    return eventosService.getEventoById(id);
  }
};

export const actualizarEvento = async (id, eventoData) => {
  try {
    // Primero actualizamos en localStorage
    await eventosService.updateEvento(id, eventoData);
    
    // Luego enviamos al backend
    const { data } = await API.put(`/admin/eventos/${id}`, eventoData);
    return data;
  } catch (error) {
    console.error('Error al actualizar evento:', error.response?.data || error.message);
    throw error;
  }
};

export const eliminarEvento = async (id) => {
  try {
    // Primero eliminamos del localStorage
    await eventosService.deleteEvento(id);
    
    // Luego enviamos al backend
    await API.delete(`/admin/eventos/${id}`);
  } catch (error) {
    console.error('Error al eliminar evento:', error.response?.data || error.message);
    throw error;
  }
};
