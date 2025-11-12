export const users = [
  {
    id: 1,
    name: "Juan Perez",
    document: "12345678",
    triage: {
      version: 1,
      submitted_at: "2023-10-01T10:00:00Z",
      answers: [
        // Ingreso del servicio
        { fieldId: "fld-1", type: "date", value: "2023-10-01" }, // Fecha de registro
        {
          fieldId: "fld-2",
          type: "multi-select",
          value: ["psicologia", "legal"],
        }, // Motivo de consulta
        { fieldId: "fld-3", type: "select", value: "primera_vez" }, // Servicio activo
        { fieldId: "fld-4", type: "date", value: null }, // Fecha última atención

        // Identificación
        { fieldId: "fld-5", type: "text", value: "Juan Perez" },
        { fieldId: "fld-6", type: "textarea", value: "Av. Siempre Viva 742" },
        { fieldId: "fld-7", type: "text", value: "Centro" },
        { fieldId: "fld-8", type: "text", value: "Quito" },
        { fieldId: "fld-9", type: "text", value: "+59399111222" },
        { fieldId: "fld-10", type: "text", value: "+59322334455" },
        { fieldId: "fld-11", type: "text", value: "juan.perez@example.com" },

        // Matrix documento: DNI vigente
        {
          fieldId: "fld-12",
          type: "matrix",
          selections: [{ row: "dni_origen", column: "vigente" }],
          observations: "Tiene copia física y digital",
        },
        { fieldId: "fld-13", type: "text", value: 12345678 },
        { fieldId: "fld-14", type: "textarea", value: "" },
        { fieldId: "fld-15", type: "date", value: "1995-04-18" },
        { fieldId: "fld-16", type: "number", value: 28 },
        { fieldId: "fld-17", type: "text", value: "Venezuela" },
        { fieldId: "fld-18", type: "date", value: "2021-06-10" },
        { fieldId: "fld-19", type: "select", value: "irregular" },
        {
          fieldId: "fld-20",
          type: "multi-select",
          value: ["vocacion_permanencia"],
        },
        { fieldId: "fld-21", type: "select", value: "hombre" },
        { fieldId: "fld-22", type: "select", value: "masculino" },
        { fieldId: "fld-23", type: "select", value: "mestizo" },
        { fieldId: "fld-24", type: "select", value: "soltero" },
        { fieldId: "fld-25", type: "text", value: "Juan Perez" },
        { fieldId: "fld-26", type: "select", value: "si" },
        { fieldId: "fld-27", type: "select", value: "padre" },

        // Vulnerabilidades (algunos ejemplos marcados)
        { fieldId: "fld-31", type: "checkbox", value: true },
        { fieldId: "fld-32", type: "checkbox", value: true },
        { fieldId: "fld-36", type: "checkbox", value: false },
        { fieldId: "fld-37", type: "checkbox", value: false },
        // Discapacidad con detalle:
        {
          fieldId: "fld-43",
          type: "checkbox",
          value: true,
          extraValue: "Visual (miopía alta)",
        },
        { fieldId: "fld-44", type: "checkbox", value: false },
        { fieldId: "fld-45", type: "checkbox", value: false },

        // Mecanismos de afrontamiento
        { fieldId: "fld-46", type: "checkbox", value: false },
        { fieldId: "fld-47", type: "select", value: "2" }, // comidas diarias
        {
          fieldId: "fld-48",
          type: "multi-select",
          value: ["arrendada", "compartida"],
        },
        { fieldId: "fld-49", type: "text", value: "4" },
        { fieldId: "fld-50", type: "checkbox", value: true },
        { fieldId: "fld-51", type: "checkbox", value: false },
        { fieldId: "fld-52", type: "text", value: "Sin niños en edad escolar" },

        // Socioeconómico
        { fieldId: "fld-53", type: "multi-select", value: ["bachillerato"] },
        { fieldId: "fld-54", type: "text", value: "Técnico en electricidad" },
        {
          fieldId: "fld-55",
          type: "select",
          value: "si",
          extraValue: "Portugués básico",
        },
        {
          fieldId: "fld-56",
          type: "textarea",
          value: "3 años en mantenimiento eléctrico.",
        },
        {
          fieldId: "fld-57",
          type: "multi-select",
          value: ["trabajo_informal"],
        },
        {
          fieldId: "fld-58",
          type: "textarea",
          value: "Instalaciones eléctricas, atención al cliente.",
        },
        { fieldId: "fld-59", type: "text", value: "350 USD" },

        // Acciones
        {
          fieldId: "fld-60",
          type: "multi-select",
          value: ["psicologia", "legal"],
        },
        { fieldId: "fld-61", type: "textarea", value: "" },
        {
          fieldId: "fld-62",
          type: "textarea",
          value: "Asesoría legal por regularización.",
        },
      ],
    },
  },
  {
    id: 2,
    name: "Maria Gomez",
    document: "87654321",
    triage: {
      version: 1,
      submitted_at: "2023-10-02T15:30:00Z",
      answers: [
        // Ingreso del servicio
        { fieldId: "fld-1", type: "date", value: "2023-10-02" },
        {
          fieldId: "fld-2",
          type: "multi-select",
          value: ["trabajo_social", "medios_vida"],
        },
        { fieldId: "fld-3", type: "select", value: "recurrente" },
        { fieldId: "fld-4", type: "date", value: "2023-09-15" },

        // Identificación
        { fieldId: "fld-5", type: "text", value: "Maria Gomez" },
        {
          fieldId: "fld-6",
          type: "textarea",
          value: "Calle 10 y Av. 2, Edificio Sol, piso 3",
        },
        { fieldId: "fld-7", type: "text", value: "Norte" },
        { fieldId: "fld-8", type: "text", value: "Guayaquil" },
        { fieldId: "fld-9", type: "text", value: "+593988877766" },
        { fieldId: "fld-10", type: "text", value: "" },
        { fieldId: "fld-11", type: "text", value: "maria.gomez@example.com" },

        // Matrix documento: Pasaporte caducado + Visa temporal vigente
        {
          fieldId: "fld-12",
          type: "matrix",
          selections: [
            { row: "pasaporte_origen", column: "caducado" },
            { row: "visa_temporal", column: "vigente" },
          ],
          observationsValue: "En trámite de renovación de pasaporte",
        },
        { fieldId: "fld-13", type: "number", value: 87654321 },
        {
          fieldId: "fld-14",
          type: "textarea",
          value: "Presentó denuncia por pérdida de DNI.",
        },
        { fieldId: "fld-15", type: "date", value: "1992-11-05" },
        { fieldId: "fld-16", type: "number", value: 30 },
        { fieldId: "fld-17", type: "text", value: "Colombia" },
        { fieldId: "fld-18", type: "date", value: "2020-02-20" },
        { fieldId: "fld-19", type: "select", value: "regular" },
        {
          fieldId: "fld-20",
          type: "multi-select",
          value: ["vocacion_permanencia"],
        },
        { fieldId: "fld-21", type: "select", value: "mujer" },
        { fieldId: "fld-22", type: "select", value: "femenino" },
        { fieldId: "fld-23", type: "select", value: "mestizo" },
        { fieldId: "fld-24", type: "select", value: "union_hecho" },
        { fieldId: "fld-25", type: "text", value: "Maria Gomez" },
        { fieldId: "fld-26", type: "select", value: "si" },
        { fieldId: "fld-27", type: "select", value: "madre" },

        // Vulnerabilidades
        { fieldId: "fld-33", type: "checkbox", value: false },
        { fieldId: "fld-34", type: "checkbox", value: true }, // Embarazada
        { fieldId: "fld-35", type: "checkbox", value: false },
        { fieldId: "fld-37", type: "checkbox", value: false },
        { fieldId: "fld-43", type: "checkbox", value: false },
        {
          fieldId: "fld-44",
          type: "checkbox",
          value: true,
          extraValue: "Hipotiroidismo",
        },
        { fieldId: "fld-45", type: "checkbox", value: false },

        // Mecanismos de afrontamiento
        { fieldId: "fld-46", type: "checkbox", value: false },
        { fieldId: "fld-47", type: "select", value: "3" },
        { fieldId: "fld-48", type: "multi-select", value: ["arrendada"] },
        { fieldId: "fld-49", type: "text", value: "3" },
        { fieldId: "fld-50", type: "checkbox", value: false },
        { fieldId: "fld-51", type: "checkbox", value: false },
        { fieldId: "fld-52", type: "text", value: "Sí, asisten regularmente" },

        // Socioeconómico
        { fieldId: "fld-53", type: "multi-select", value: ["superior"] },
        {
          fieldId: "fld-54",
          type: "text",
          value: "Administración de Empresas",
        },
        {
          fieldId: "fld-55",
          type: "select",
          value: "si",
          extraValue: "Inglés intermedio",
        },
        {
          fieldId: "fld-56",
          type: "textarea",
          value: "Experiencia en ventas y logística.",
        },
        { fieldId: "fld-57", type: "multi-select", value: ["trabajo_formal"] },
        {
          fieldId: "fld-58",
          type: "textarea",
          value: "Excel, comunicación, gestión de equipos.",
        },
        { fieldId: "fld-59", type: "text", value: "650 USD" },

        // Acciones
        {
          fieldId: "fld-60",
          type: "multi-select",
          value: ["trabajo_social", "promocion_medios_vida"],
        },
        {
          fieldId: "fld-61",
          type: "textarea",
          value: "ONG X para apoyo prenatal.",
        },
        {
          fieldId: "fld-62",
          type: "textarea",
          value: "Mejorar inserción laboral y estabilidad.",
        },
      ],
    },
  },
  {
    id: 3,
    name: "Carlos Ruiz",
    document: "11223344",
    triage: {
      date: "2023-10-03",
    },
  },
  {
    id: 4,
    name: "Ana Torres",
    document: "44332211",
    triage: {
      date: "2023-10-04",
    },
  },
  { id: 5, name: "Luis Fernandez", document: "55667788" },
  { id: 6, name: "Sofia Martinez", document: "88776655" },
  { id: 7, name: "Miguel Sanchez", document: "99887766" },
  { id: 8, name: "Laura Diaz", document: "66778899" },
  { id: 9, name: "Pedro Lopez", document: "33445566" },
  { id: 10, name: "Elena Ramirez", document: "66554433" },
  { id: 11, name: "Jorge Castillo", document: "77889900" },
  { id: 12, name: "Carmen Morales", document: "00998877" },
  { id: 13, name: "Diego Herrera", document: "22334455" },
  { id: 14, name: "Isabel Jimenez", document: "55443322" },
  { id: 15, name: "Rafael Vargas", document: "88990011" },
];
