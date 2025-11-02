/**
 * Datos estáticos de Facultades y Programas Académicos
 * Universidad Popular del Cesar
 * 
 * NOTA: Estos son datos de respaldo mientras se configura el acceso público al endpoint
 * Una vez el backend esté configurado, se usarán los datos del API
 */

export const FACULTADES_ESTATICAS = [
  {
    id: "FAC_CACE",
    nombre: "Ciencias Administrativas, Contables y Económicas",
    codigo: "FAC_CACE",
    descripcion: "Facultad de Ciencias Administrativas, Contables y Económicas"
  },
  {
    id: "FAC_ARTES",
    nombre: "Bellas Artes",
    codigo: "FAC_ARTES",
    descripcion: "Facultad de Bellas Artes"
  },
  {
    id: "FAC_DCPS",
    nombre: "Derecho, Ciencias Políticas y Sociales",
    codigo: "FAC_DCPS",
    descripcion: "Facultad de Derecho, Ciencias Políticas y Sociales"
  },
  {
    id: "FAC_CBASICAS",
    nombre: "Ciencias Básicas",
    codigo: "FAC_CBASICAS",
    descripcion: "Facultad de Ciencias Básicas"
  },
  {
    id: "FAC_ING",
    nombre: "Ingenierías y Tecnologías",
    codigo: "FAC_ING",
    descripcion: "Facultad de Ingenierías y Tecnologías"
  },
  {
    id: "FAC_SALUD",
    nombre: "Ciencias de la Salud",
    codigo: "FAC_SALUD",
    descripcion: "Facultad de Ciencias de la Salud"
  },
  {
    id: "FAC_EDU",
    nombre: "Educación",
    codigo: "FAC_EDU",
    descripcion: "Facultad de Educación"
  }
];

export const PROGRAMAS_ESTATICOS = {
  "FAC_CACE": [
    {
      codigo: "ADM_EMP",
      nombre: "Administración de Empresas",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_CACE"
    },
    {
      codigo: "CONT_PUB",
      nombre: "Contaduría Pública",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_CACE"
    },
    {
      codigo: "ECONOMIA",
      nombre: "Economía",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_CACE"
    },
    {
      codigo: "COM_INT",
      nombre: "Comercio Internacional",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_CACE"
    },
    {
      codigo: "ADM_HOT",
      nombre: "Administración de Empresas Hoteleras",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_CACE"
    }
  ],
  "FAC_ARTES": [
    {
      codigo: "LIC_ARTES",
      nombre: "Licenciatura en Artes",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_ARTES"
    },
    {
      codigo: "MUSICA",
      nombre: "Música",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_ARTES"
    }
  ],
  "FAC_DCPS": [
    {
      codigo: "DERECHO",
      nombre: "Derecho",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_DCPS"
    },
    {
      codigo: "PSICOLOGIA",
      nombre: "Psicología",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_DCPS"
    },
    {
      codigo: "SOCIOLOGIA",
      nombre: "Sociología",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_DCPS"
    }
  ],
  "FAC_CBASICAS": [
    {
      codigo: "MICROBIO",
      nombre: "Microbiología",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_CBASICAS"
    }
  ],
  "FAC_ING": [
    {
      codigo: "ING_SIS",
      nombre: "Ingeniería de Sistemas",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_ING"
    },
    {
      codigo: "ING_AGRO",
      nombre: "Ingeniería Agroindustrial",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_ING"
    },
    {
      codigo: "ING_ELEC",
      nombre: "Ingeniería Electrónica",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_ING"
    },
    {
      codigo: "ING_AMB",
      nombre: "Ingeniería Ambiental y Sanitaria",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_ING"
    }
  ],
  "FAC_SALUD": [
    {
      codigo: "INST_QUI",
      nombre: "Instrumentación Quirúrgica",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_SALUD"
    },
    {
      codigo: "ENFERMERIA",
      nombre: "Enfermería",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_SALUD"
    },
    {
      codigo: "FISIOTER",
      nombre: "Fisioterapia",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_SALUD"
    }
  ],
  "FAC_EDU": [
    {
      codigo: "LIC_NAT",
      nombre: "Licenciatura en Ciencias Naturales y Educación Ambiental",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_EDU"
    },
    {
      codigo: "LIC_MAT",
      nombre: "Licenciatura en Matemáticas",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_EDU"
    },
    {
      codigo: "LIC_LIT",
      nombre: "Licenciatura en Literatura y Lengua Castellana",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_EDU"
    },
    {
      codigo: "LIC_ING",
      nombre: "Licenciatura en Español e Inglés",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_EDU"
    },
    {
      codigo: "LIC_EDU_FIS",
      nombre: "Licenciatura en Educación Física, Recreación y Deporte",
      nivel: "Pregrado",
      modalidad: "Presencial",
      facultadId: "FAC_EDU"
    }
  ]
};

/**
 * Obtener todos los programas en un solo array
 */
export const obtenerTodosProgramasEstaticos = () => {
  return Object.values(PROGRAMAS_ESTATICOS).flat();
};
