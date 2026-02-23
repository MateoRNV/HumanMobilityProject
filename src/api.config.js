/**
 * Capa de abstracción para llamadas al backend Human Mobility.
 * Usa fetch nativo (sin dependencias extra) adecuado para entornos municipales.
 */

// Revisar las APIS

// const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? 'http://localhost:3001/api';
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? 'https://wandering-lil-human-mobility-b37b6d7c.koyeb.app/api';
// const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? 'https://human-mobility-backend.onrender.com/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function handleResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data?.message ??
      data?.error ??
      `Error ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return data;
}

/**
 * Cliente HTTP genérico para el API.
 */
export const apiClient = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    return handleResponse(response);
  },

  async post(endpoint, body) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body ?? {}),
    });
    return handleResponse(response);
  },

  async patch(endpoint, body) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: defaultHeaders,
      body: JSON.stringify(body ?? {}),
    });
    return handleResponse(response);
  },

  async put(endpoint, body) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(body ?? {}),
    });
    return handleResponse(response);
  },
};

/**
 * API de personas (backend /api/personas).
 */
export const personsApi = {
  /** GET /api/personas - Lista todas las personas */
  getList() {
    return apiClient.get('/personas');
  },

  /** GET /api/personas/:id - Una persona por id */
  getOne(id) {
    return apiClient.get(`/personas/${id}`);
  },

  /** POST /api/personas - Crear persona. Body: { nombre: string, documento?: string } */
  create({ nombre, documento = null }) {
    return apiClient.post('/personas', { nombre, documento });
  },

  /** PATCH /api/personas/:id - Actualizar persona */
  update(id, { nombre, documento }) {
    return apiClient.patch(`/personas/${id}`, { nombre, documento });
  },

  /** GET /api/personas/:personaId/cuestionarios/:slug - Obtener cuestionario */
  getForm(personaId, slug) {
    return apiClient.get(`/personas/${personaId}/cuestionarios/${slug}`);
  },

  /** PUT /api/personas/:personaId/cuestionarios/:slug - Guardar cuestionario */
  saveForm(personaId, slug, { version_cuestionario, respuestas }) {
    return apiClient.put(`/personas/${personaId}/cuestionarios/${slug}`, {
      version_cuestionario,
      respuestas,
    });
  },

  /** GET /api/forms/definition/:slug - Obtener estructura (schema) */
  getDefinition(slug) {
    return apiClient.get(`/forms/definition/${slug}`);
  },
};

export const apiService = {
  get: (endpoint) => apiClient.get(endpoint),
  post: (endpoint, data) => apiClient.post(endpoint, data),
};
