# HumanMobility — Frontend

SPA construida con **React 19 + Vite + TailwindCSS** para la gestión de casos de personas en situación de movilidad humana (MDMQ).

## Requisitos previos

- Node.js 20+
- Backend HumanMobility corriendo (ver `../HumanMobilityBackend/README.md`)

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Sin esta variable, el frontend usa `http://localhost:3001/api` por defecto.

## Comandos

```bash
npm run dev       # Servidor de desarrollo en http://localhost:5173
npm run build     # Build de producción en dist/
npm run preview   # Previsualizar el build de producción
npm run lint      # ESLint
```

## Estructura de carpetas relevante

```
src/
├── api/
│   └── api.config.js        # Cliente HTTP con inyección de JWT y manejo de 401
├── components/
│   ├── ProtectedRoute.jsx   # Redirige a /login si no hay sesión
│   └── ui/                  # Componentes reutilizables (Spinner, Modal, inputs...)
├── context/
│   └── AuthContext.jsx      # Estado global de autenticación (profesional, token)
├── pages/
│   ├── Login/               # Página de inicio de sesión
│   ├── Menu/                # Listado de personas y búsqueda
│   ├── FormRenderer/        # Renderizado dinámico de formularios
│   ├── FormHistory/         # Historial de versiones de un formulario
│   └── QuestionnaireEditor/ # Editor de esquemas de cuestionarios
└── App.jsx                  # Rutas con AuthProvider y ProtectedRoute
```

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Home |
| `/login` | Público | Inicio de sesión |
| `/menu` | JWT | Listado de personas |
| `/formulario/:slug/:personaId` | JWT | Rellenar / editar formulario |
| `/editor/:slug` | JWT | Editar esquema del cuestionario |
| `/historial/:slug/:personaId` | JWT | Ver historial de respuestas |

## Autenticación

El token JWT se guarda en `localStorage` bajo la clave `token`. El cliente HTTP (`api.config.js`) lo inyecta automáticamente en cada petición. Si el backend responde con `401`, el token se elimina y el usuario es redirigido a `/login`.

## Despliegue con Docker

```bash
# Desde la raíz del proyecto (HumanMobility/)
docker-compose up --build
# Frontend disponible en http://localhost:8080
```

Para despliegue en Vercel, la variable de entorno `VITE_API_BASE_URL` debe apuntar a la URL del backend en producción.
