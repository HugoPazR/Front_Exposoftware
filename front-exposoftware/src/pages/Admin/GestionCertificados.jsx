import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Chip } from 'primereact/chip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import logo from '../../assets/Logo-unicesar.png';
import CertificadosService from '../../Services/CertificadosService';
import * as AuthService from '../../Services/AuthService';

/**
 * Componente para gestionar certificados de participación
 * - Listar lotes de certificados
 * - Enviar certificados por correo
 * - Descargar lotes de certificados en ZIP
 */
export default function GestionCertificados() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [asuntoEmail, setAsuntoEmail] = useState('');
  const [mensajePersonalizado, setMensajePersonalizado] = useState('');
  const topScrollbarRef = useRef(null);
  const tableRef = useRef(null);
  const toast = useRef(null);

  // Cargar datos del usuario autenticado
  useEffect(() => {
    const user = AuthService.getUserData();
    if (user) {
      setUserData(user);
      console.log('👤 Usuario autenticado:', user);
    } else {
      console.warn('⚠️ No hay usuario autenticado');
      navigate('/login');
    }
  }, [navigate]);

  // Cargar lotes de certificados al montar el componente
  useEffect(() => {
    cargarLotes();
  }, []);

  // Configurar scrollbar superior
  useEffect(() => {
    const setupScrollbar = () => {
      const topScrollbar = topScrollbarRef.current;
      const tableContainer = tableRef.current;
      
      if (topScrollbar && tableContainer) {
        const scrollableView = tableContainer.querySelector('.p-datatable-scrollable-view');
        
        if (scrollableView) {
          // Ajustar el ancho del scrollbar superior para que coincida con la tabla
          const adjustScrollbar = () => {
            const tableWidth = scrollableView.scrollWidth;
            const containerWidth = scrollableView.clientWidth;
            
            if (tableWidth > containerWidth) {
              topScrollbar.style.width = `${containerWidth}px`;
              topScrollbar.style.display = 'block';
              topScrollbar.querySelector('.top-scrollbar-content').style.width = `${tableWidth}px`;
            } else {
              topScrollbar.style.display = 'none';
            }
          };
          
          // Ajustar inicialmente
          setTimeout(adjustScrollbar, 100);
          
          // Observar cambios en el tamaño
          const resizeObserver = new ResizeObserver(adjustScrollbar);
          resizeObserver.observe(scrollableView);
          
          return () => resizeObserver.disconnect();
        }
      }
    };

    const timeoutId = setTimeout(setupScrollbar, 300);
    return () => clearTimeout(timeoutId);
  }, [lotes]);

  /**
   * Cargar listado de lotes de certificados
   */
  const cargarLotes = async () => {
    setLoading(true);
    try {
      const response = await CertificadosService.obtenerLotesCertificados();
      console.log('📦 Respuesta completa:', response);
      
      // La respuesta puede venir como {status: 'success', data: {...}} o directamente como array
      let lotesData = [];
      
      if (response.status === 'success' && response.data) {
        // Si data es un objeto con propiedad lotes
        if (response.data.lotes && Array.isArray(response.data.lotes)) {
          lotesData = response.data.lotes;
        }
        // Si data directamente es un array
        else if (Array.isArray(response.data)) {
          lotesData = response.data;
        }
        // Si data es un objeto con otras propiedades
        else {
          console.warn('⚠️ Estructura de datos inesperada:', response.data);
          lotesData = [];
        }
      }
      // Si response directamente es un array
      else if (Array.isArray(response)) {
        lotesData = response;
      }
      
      setLotes(lotesData);
      console.log('✅ Lotes procesados:', lotesData);
      
      toast.current?.show({
        severity: 'success',
        summary: 'Lotes cargados',
        detail: `Se cargaron ${lotesData.length} lote(s) de certificados`,
        life: 3000
      });
    } catch (error) {
      console.error('Error al cargar lotes:', error);
      setLotes([]); // Asegurar que sea un array vacío en caso de error
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.detail || 'No se pudieron cargar los lotes de certificados',
        life: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Descargar lote de certificados en ZIP
   */
  const descargarLote = async (id_lote) => {
    try {
      toast.current?.show({
        severity: 'info',
        summary: 'Descargando',
        detail: 'Preparando descarga de certificados...',
        life: 3000
      });

      await CertificadosService.descargarLoteCertificados(id_lote);

      toast.current?.show({
        severity: 'success',
        summary: 'Descarga completa',
        detail: 'Los certificados se han descargado correctamente',
        life: 3000
      });
    } catch (error) {
      console.error('Error al descargar lote:', error);
      
      let errorMessage = 'No se pudo descargar el lote de certificados';
      
      // Extraer mensaje de error más específico
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 502) {
        errorMessage = 'El servidor está experimentando problemas. Por favor, intenta más tarde.';
      } else if (error.response?.status === 404) {
        errorMessage = 'El lote de certificados no existe o ya fue eliminado.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor al generar los certificados.';
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Error en descarga',
        detail: errorMessage,
        life: 6000
      });
    }
  };

  /**
   * Abrir diálogo para enviar certificados por correo
   */
  const abrirDialogoEmail = (lote) => {
    setSelectedLote(lote);
    setAsuntoEmail('Certificado de Participación - ExpoSoftware');
    setMensajePersonalizado('Estimado/a estudiante,\n\nAdjunto encontrará su certificado de participación en ExpoSoftware.\n\nSaludos cordiales.');
    setShowEmailDialog(true);
  };

  /**
   * Enviar certificados por correo electrónico
   */
  const enviarPorCorreo = async () => {
    if (!selectedLote) return;

    // Validar campos requeridos
    if (!asuntoEmail.trim() || !mensajePersonalizado.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos Requeridos',
        detail: 'Por favor complete el asunto y el mensaje personalizado',
        life: 3000
      });
      return;
    }

    setSendingEmails(true);
    try {
      // Enviamos id_lote, asunto y mensaje_personalizado
      const response = await CertificadosService.enviarCertificadosPorCorreo(
        selectedLote.id_lote,
        asuntoEmail,
        mensajePersonalizado
      );

      console.log('📨 Respuesta de envío:', response);

      // Verificar si hubo envíos exitosos
      const totalEnviados = response.data?.enviados_exitosamente || 0;
      const totalFallidos = response.data?.envios_fallidos || 0;
      const detallesFallidos = response.data?.detalles_fallidos || [];

      if (totalEnviados > 0) {
        // Hubo al menos un envío exitoso
        toast.current?.show({
          severity: 'success',
          summary: 'Certificados enviados',
          detail: `Se enviaron exitosamente ${totalEnviados} certificado(s)${totalFallidos > 0 ? `. ${totalFallidos} envío(s) fallaron.` : ''}`,
          life: 6000
        });
      } else if (totalFallidos > 0) {
        // Todos los envíos fallaron
        let errorDetail = `No se pudo enviar ningún certificado. ${totalFallidos} envío(s) fallaron.`;
        
        // Guardar detalles para mostrar en diálogo
        setErrorDetails(response.data);
        
        // Mostrar detalles de los errores si están disponibles
        if (detallesFallidos.length > 0) {
          const primerosErrores = detallesFallidos.slice(0, 2).map(f => f.error).join(', ');
          errorDetail += ` Errores: ${primerosErrores}`;
        }

        toast.current?.show({
          severity: 'warn',
          summary: 'Error en envíos',
          detail: errorDetail,
          life: 8000
        });

        // Mostrar diálogo con detalles de errores
        setShowErrorDialog(true);
      } else {
        // Respuesta inesperada
        toast.current?.show({
          severity: 'info',
          summary: 'Operación completada',
          detail: response.mensaje || 'Se procesó la solicitud de envío',
          life: 5000
        });
      }

      setShowEmailDialog(false);
      setSelectedLote(null);
      
      // Recargar lotes para actualizar estado
      cargarLotes();
    } catch (error) {
      console.error('Error al enviar certificados:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = 'No se pudieron enviar los certificados por correo';
      
      // Manejar errores 400 Bad Request
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.log('Error data type:', typeof errorData);
        console.log('Error data:', errorData);
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData && typeof errorData === 'object') {
          // Intentar extraer mensaje del objeto
          errorMessage = errorData.mensaje || errorData.detail || errorData.message || JSON.stringify(errorData);
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'El lote de certificados no fue encontrado. Puede que haya sido eliminado.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Es posible que el servicio de correo no esté configurado correctamente.';
      } else if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (typeof errorData === 'object') {
          errorMessage = errorData.detail || errorData.mensaje || errorData.message || JSON.stringify(errorData);
        }
      } else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      // Asegurar que errorMessage sea string
      if (typeof errorMessage !== 'string') {
        errorMessage = 'Error desconocido al enviar certificados';
      }
      
      toast.current?.show({
        severity: 'error',
        summary: 'Error al enviar',
        detail: errorMessage,
        life: 6000
      });
    } finally {
      setSendingEmails(false);
    }
  };

  /**
   * Template para columna de fecha
   */
  const fechaTemplate = (rowData) => {
    if (!rowData.fecha_generacion) return '-';
    try {
      const fecha = new Date(rowData.fecha_generacion);
      return fecha.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return rowData.fecha_generacion;
    }
  };

  /**
   * Template para columna de cantidad
   */
  const cantidadTemplate = (rowData) => {
    return (
      <Chip 
        label={rowData.cantidad_certificados || 0} 
        className="bg-teal-100 text-teal-800"
      />
    );
  };

  /**
   * Template para columna de estado
   */
  const estadoTemplate = (rowData) => {
    const estado = rowData.estado || 'disponible';
    const estadoConfig = {
      'disponible': { severity: 'success', icon: 'pi-check-circle', label: 'Disponible' },
      'enviado': { severity: 'info', icon: 'pi-send', label: 'Enviado' },
      'expirado': { severity: 'warning', icon: 'pi-clock', label: 'Expirado' },
      'error': { severity: 'danger', icon: 'pi-times-circle', label: 'Error' }
    };
    
    const config = estadoConfig[estado] || estadoConfig['disponible'];
    const colorClass = {
      'success': 'bg-green-100 text-green-800',
      'info': 'bg-blue-100 text-blue-800',
      'warning': 'bg-amber-100 text-amber-800',
      'danger': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass[config.severity]}`}>
        <i className={`pi ${config.icon} text-xs`}></i>
        {config.label}
      </span>
    );
  };

  /**
   * Template para columna de acciones
   */
  const accionesTemplate = (rowData) => {
    const yaEnviado = rowData.estado === 'enviado';

    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-envelope"
          className={`p-button-rounded p-button-sm ${yaEnviado ? 'p-button-secondary' : 'p-button-info'}`}
          tooltip={yaEnviado ? 'Reenviar por correo' : 'Enviar por correo'}
          tooltipOptions={{ position: 'top' }}
          onClick={() => abrirDialogoEmail(rowData)}
        />
      </div>
    );
  };  /**
   * Template para columna de proyecto
   */
  const proyectoTemplate = (rowData) => {
    const nombreProyecto = rowData.proyecto?.nombre_proyecto || rowData.nombre_proyecto || 'Sin nombre';
    return (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{nombreProyecto}</div>
        <div className="text-xs text-gray-500 truncate" style={{maxWidth: '200px'}}>
          ID: {rowData.id_proyecto}
        </div>
      </div>
    );
  };

  /**
   * Template para columna de evento
   */
  const eventoTemplate = (rowData) => {
    const nombreEvento = rowData.evento?.nombre_evento || rowData.nombre_evento || 'Sin nombre';
    return (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{nombreEvento}</div>
        {rowData.evento?.lugar && (
          <div className="text-xs text-gray-500">{rowData.evento.lugar}</div>
        )}
      </div>
    );
  };

  // Obtener nombre e iniciales del usuario
  const getUserName = () => {
    if (!userData) return 'Administrador';
    return userData.nombre || userData.nombres || userData.correo?.split('@')[0] || 'Administrador';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      try {
        await AuthService.logout();
        navigate('/login');
      } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .top-scrollbar-container::-webkit-scrollbar {
          height: 16px;
        }
        .top-scrollbar-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .top-scrollbar-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
          border: 2px solid #f1f5f9;
        }
        .top-scrollbar-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-datatable .p-datatable-scrollable-wrapper .p-datatable-scrollable-view::-webkit-scrollbar {
          height: 16px;
        }
        .custom-datatable .p-datatable-scrollable-wrapper .p-datatable-scrollable-view::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .custom-datatable .p-datatable-scrollable-wrapper .p-datatable-scrollable-view::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
          border: 2px solid #f1f5f9;
        }
        .custom-datatable .p-datatable-scrollable-wrapper .p-datatable-scrollable-view::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      <Toast ref={toast} />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Unicesar" className="w-10 h-auto" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expo-software </h1>
                <p className="text-xs text-gray-500">Universidad Popular del Cesar</p>
              </div>
            </div>

            {/* User avatar and logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">{getUserName()}</span>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-lg">{getUserInitials()}</span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
                <i className="pi pi-sign-out"></i>
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminSidebar 
            userName={getUserName()} 
            userRole="Administrador" 
          />

          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    <i className="pi pi-file-pdf mr-2 text-teal-600"></i>
                    Gestión de Certificados
                  </h1>
                  <p className="text-sm text-gray-600">
                    Administra los lotes de certificados generados
                  </p>
                </div>
                <Button
                  icon="pi pi-refresh"
                  label="Recargar"
                  className="p-button-outlined p-button-sm"
                  onClick={cargarLotes}
                  loading={loading}
                />
              </div>

              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-xs">Total Lotes</p>
                      <p className="text-2xl font-bold">{lotes.length}</p>
                    </div>
                    <i className="pi pi-folder text-3xl opacity-50"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs">Total Certificados</p>
                      <p className="text-2xl font-bold">
                        {lotes.reduce((sum, lote) => sum + (lote.cantidad_certificados || 0), 0)}
                      </p>
                    </div>
                    <i className="pi pi-file text-3xl opacity-50"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-xs">Último Lote</p>
                      <p className="text-sm font-semibold">
                        {lotes.length > 0 
                          ? new Date(lotes[0].fecha_generacion).toLocaleDateString('es-CO')
                          : '-'
                        }
                      </p>
                    </div>
                    <i className="pi pi-calendar text-3xl opacity-50"></i>
                  </div>
                </div>
              </div>

              {/* Tabla de lotes */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <ProgressSpinner />
                </div>
              ) : lotes.length === 0 ? (
                <div className="text-center py-12">
                  <i className="pi pi-inbox text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay lotes de certificados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Los certificados se generan automáticamente cuando se registran proyectos
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      <i className="pi pi-info-circle mr-2"></i>
                      Para generar certificados, primero debes tener proyectos registrados en el sistema
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Scrollbar superior funcional */}
                  <div 
                    ref={topScrollbarRef}
                    className="top-scrollbar-container"
                    style={{
                      height: '20px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      display: 'none',
                      cursor: 'pointer'
                    }}
                    onScroll={(e) => {
                      const tableScroll = tableRef.current?.querySelector('.p-datatable-scrollable-view');
                      if (tableScroll) {
                        tableScroll.scrollLeft = e.target.scrollLeft;
                      }
                    }}
                  >
                    <div 
                      className="top-scrollbar-content"
                      style={{
                        height: '1px',
                        backgroundColor: 'transparent',
                        minWidth: '1200px'
                      }}
                    ></div>
                  </div>
                  
                  <div ref={tableRef}>
                    <DataTable
                      value={lotes}
                      paginator
                      rows={15}
                      rowsPerPageOptions={[10, 15, 25, 50]}
                      className="p-datatable-sm custom-datatable"
                      emptyMessage="No hay lotes de certificados disponibles"
                      sortMode="multiple"
                      stripedRows
                      size="small"
                      scrollable
                      scrollHeight="500px"
                      onScroll={(e) => {
                        const topScrollbar = topScrollbarRef.current;
                        if (topScrollbar) {
                          topScrollbar.scrollLeft = e.target.scrollLeft;
                        }
                      }}
                    >
                      <Column
                        field="id_lote"
                        header="ID Lote"
                        sortable
                        style={{ minWidth: '180px', fontSize: '0.875rem' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                      <Column
                        field="proyecto.nombre_proyecto"
                        header="Proyecto"
                        body={proyectoTemplate}
                        sortable
                        style={{ minWidth: '200px' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                      <Column
                        field="evento.nombre_evento"
                        header="Evento"
                        body={eventoTemplate}
                        sortable
                        style={{ minWidth: '180px' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                      <Column
                        field="cantidad_certificados"
                        header="Cant."
                        body={cantidadTemplate}
                        sortable
                        style={{ minWidth: '80px' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                      <Column
                        field="estado"
                        header="Estado"
                        body={estadoTemplate}
                        sortable
                        style={{ minWidth: '120px' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                      <Column
                        field="fecha_generacion"
                        header="Fecha"
                        body={fechaTemplate}
                        sortable
                        style={{ minWidth: '140px', fontSize: '0.875rem' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                      <Column
                        header="Acciones"
                        body={accionesTemplate}
                        style={{ minWidth: '120px' }}
                        bodyStyle={{ padding: '0.5rem' }}
                      />
                    </DataTable>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Diálogo para enviar por correo */}
      <Dialog
        header="Enviar Certificados por Correo"
        visible={showEmailDialog}
        style={{ width: '650px' }}
        onHide={() => {
          setShowEmailDialog(false);
          setAsuntoEmail('');
          setMensajePersonalizado('');
        }}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setShowEmailDialog(false);
                setAsuntoEmail('');
                setMensajePersonalizado('');
              }}
            />
            <Button
              label="Enviar"
              icon="pi pi-send"
              className="p-button-success"
              onClick={enviarPorCorreo}
              loading={sendingEmails}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lote seleccionado
            </label>
            <div className="bg-gray-100 p-3 rounded">
              <p className="font-semibold">{selectedLote?.proyecto?.nombre_proyecto || selectedLote?.nombre_proyecto}</p>
              <p className="text-sm text-gray-600">
                {selectedLote?.cantidad_certificados} certificado(s) para {selectedLote?.cantidad_certificados} estudiante(s)
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ID: {selectedLote?.id_lote}
              </p>
            </div>
          </div>

          {/* Campo de Asunto */}
          <div>
            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
              Asunto del Correo <span className="text-red-500">*</span>
            </label>
            <InputText
              id="asunto"
              value={asuntoEmail}
              onChange={(e) => setAsuntoEmail(e.target.value)}
              placeholder="Ej: Certificado de Participación - ExpoSoftware"
              className="w-full"
            />
            <small className="text-gray-500">
              Este será el asunto que verán los destinatarios en su correo.
            </small>
          </div>

          {/* Campo de Mensaje Personalizado */}
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje Personalizado <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              id="mensaje"
              value={mensajePersonalizado}
              onChange={(e) => setMensajePersonalizado(e.target.value)}
              rows={5}
              placeholder="Escriba el mensaje que acompañará el certificado..."
              className="w-full"
            />
            <small className="text-gray-500">
              Este mensaje se incluirá en el cuerpo del correo electrónico.
            </small>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-start gap-2">
              <i className="pi pi-info-circle text-blue-600 mt-0.5"></i>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Envío automático</p>
                <p>El sistema enviará los certificados con el asunto y mensaje que especificaste a los correos de todos los estudiantes del lote.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm text-green-800">
              <i className="pi pi-check-circle mr-2"></i>
              Los certificados se enviarán en formato PDF adjunto por correo electrónico
            </p>
          </div>
        </div>
      </Dialog>

      {/* Diálogo de detalles de errores */}
      <Dialog
        header="Detalles de Errores de Envío"
        visible={showErrorDialog}
        style={{ width: '600px' }}
        onHide={() => setShowErrorDialog(false)}
        footer={
          <Button
            label="Cerrar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => setShowErrorDialog(false)}
          />
        }
      >
        {errorDetails && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="flex items-start gap-2">
                <i className="pi pi-exclamation-triangle text-red-600 mt-0.5"></i>
                <div>
                  <p className="font-semibold text-red-900">
                    {errorDetails.enviados_exitosamente} exitosos / {errorDetails.envios_fallidos} fallidos
                  </p>
                  <p className="text-sm text-red-700 mt-1">{errorDetails.mensaje}</p>
                </div>
              </div>
            </div>

            {errorDetails.detalles_fallidos && errorDetails.detalles_fallidos.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Envíos Fallidos:</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {errorDetails.detalles_fallidos.map((detalle, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded p-3">
                      <div className="flex items-start gap-2">
                        <i className="pi pi-times-circle text-red-500 mt-0.5"></i>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {detalle.estudiante || 'Estudiante desconocido'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {detalle.correo || 'Sin correo'}
                          </p>
                          <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                            <strong>Error:</strong> {detalle.error}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                <i className="pi pi-info-circle mr-2"></i>
                <strong>Posibles causas:</strong> Correos inválidos, servicio de email no configurado, límite de envíos excedido, o problemas de conectividad.
              </p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
