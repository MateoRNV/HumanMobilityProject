import { Routes, Route, useNavigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Menu from "./pages/Menu/Menu";
import FormRenderer from "./pages/FormRenderer/FormRenderer";
import QuestionnaireEditor from "./pages/QuestionnaireEditor/QuestionnaireEditor";
import FormHistory from "./pages/FormHistory/FormHistory";
import "./App.css";

function LayoutWithBanner({ children }) {
  const { profesional, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/menu");
  };

  const nombreMostrar = profesional
    ? profesional.nombreCompleto ||
      `${profesional.nombres || profesional.nombre || ""} ${profesional.apellidos || profesional.apellido || ""}`.trim()
    : "";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <header className="bg-[#1D3A6C] shadow-md z-50 sticky top-0 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[18%] w-64 h-64 rounded-full bg-[#C02424] opacity-20 blur-2xl"></div>
          <div className="absolute bottom-[-20%] right-[-5%] w-[30rem] h-[30rem] rounded-full bg-[#C02424] opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex justify-between items-center h-20 w-full">
            {/* Left side - Logo and Titles */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={handleHome}
            >
              <div className="flex-shrink-0 transition-opacity duration-300 group-hover:opacity-90">
                <img
                  src="/assets/img/logo_bn.png"
                  alt="Casa sin Fronteras"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <span
                  className="text-lg md:text-xl mt-0 transform -rotate-1 opacity-90"
                  style={{ fontFamily: "'Caveat', cursive", color: "#ffff" }}
                >
                  Casa sin Fronteras
                </span>
              </div>
            </div>

            {/* Right side - User Info and Logout */}
            <div className="flex items-center gap-3 sm:gap-5">
              {profesional && (
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-white/90">
                    {nombreMostrar}
                  </span>
                  <span className="text-[10px] text-white/70 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 opacity-80 rounded-full"></span>
                    {profesional.rol}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-white/90 hover:text-white transition-colors focus:outline-none"
                title="Cerrar sesión"
              >
                <span className="hidden sm:inline text-xs font-medium">
                  Salir
                </span>
                <span className="material-symbols-outlined text-base sm:text-lg">
                  logout
                </span>
              </button>

              {/* Quito Renace Logo */}
              {/* <div className="hidden lg:flex items-center pl-4 border-l border-white/20">
                <img
                  src="/assets/img/quito_renace_sf.png"
                  alt="Quito Renace"
                  className="h-7 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col relative z-0">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <LayoutWithBanner>
                <Menu />
              </LayoutWithBanner>
            </ProtectedRoute>
          }
        />
        <Route
          path="/formulario/:slug/:personaId"
          element={
            <ProtectedRoute>
              <LayoutWithBanner>
                <FormRenderer />
              </LayoutWithBanner>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:slug"
          element={
            <ProtectedRoute adminOnly>
              <QuestionnaireEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial/:slug/:personaId"
          element={
            <ProtectedRoute>
              <FormHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
