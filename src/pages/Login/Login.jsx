import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Sesión iniciada");
      navigate("/menu");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-[#1D3A6C] relative overflow-hidden flex-col justify-center items-center p-12">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
          <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full bg-[#C02424] opacity-20 blur-2xl"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-[#C02424] opacity-10 blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-xl text-center">
          <div className="mb-10 transform hover:scale-105 transition-transform duration-500 ease-out">
            <img
              src="/assets/img/logo_bn.png"
              alt="Casa sin Fronteras"
              className="w-64 h-auto md:w-80 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Casa Metropolitana <br />
              <span className="text-white font-black drop-shadow-lg">
                de Movilidad Humana
              </span>
            </h1>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl mt-2 transform -rotate-2 drop-shadow-md"
              style={{ fontFamily: "'Caveat', cursive", color: "#E31B23" }}
            >
              Casa sin Fronteras
            </h2>
          </div>
          <p className="text-blue-100/90 text-lg lg:text-xl font-medium max-w-md mt-4 leading-relaxed">
            Un espacio de protección, acogida y restitución de derechos para
            todos.
          </p>

          <div className="mt-16 flex items-center justify-center opacity-90 border-t border-white/10 pt-6">
            <img
              src="/assets/img/quito_renace_sf.png"
              alt="Quito Renace"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full md:w-1/2 lg:w-2/5 items-center justify-center p-8 sm:p-12 lg:p-16 bg-white relative">
        <div className="w-full max-w-md flex flex-col gap-8 z-10">
          {/* Mobile Logo Fallback */}
          <div className="md:hidden flex flex-col items-center justify-center mb-6">
            <div className="mb-4">
              <img
                src="/assets/img/logo_bn.png"
                alt="Casa sin Fronteras"
                className="w-40 h-auto object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1D3A6C] text-center mb-2">
              Casa Metropolitana <br />
              <span className="text-[#1D3A6C]">de Movilidad Humana</span>
            </h1>
            <h2
              className="text-3xl md:text-4xl mt-1 transform -rotate-2"
              style={{ fontFamily: "'Caveat', cursive", color: "#E31B23" }}
            >
              Casa sin Fronteras
            </h2>
          </div>

          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D3A6C] mb-2 tracking-tight">
              Bienvenido
            </h2>
            <p className="text-gray-500 text-base font-medium">
              Ingresa tus credenciales para acceder a la plataforma de gestión
              MDMQ.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1D3A6C] uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#1D3A6C] text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="profesional@mdmq.gob.ec"
                  className="pl-11 w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-800 transition-all duration-300 focus:bg-white focus:outline-none focus:border-[#1D3A6C] focus:ring-4 focus:ring-[#1D3A6C]/10 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-[#1D3A6C] uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#1D3A6C] text-gray-400">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="pl-11 w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-800 transition-all duration-300 focus:bg-white focus:outline-none focus:border-[#1D3A6C] focus:ring-4 focus:ring-[#1D3A6C]/10 hover:border-gray-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-[#27367c] hover:bg-[#1a2556] focus:outline-none focus:ring-4 focus:ring-[#27367c]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              {submitting ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Ingresar a la plataforma"
              )}
            </button>
          </form>

          {/* Footer of the right side */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
            {/* Mobile-only Quito Renace logo */}
            <div className="flex md:hidden items-center justify-center opacity-90">
              <img
                src="/assets/img/quito_renace_sf.png"
                alt="Quito Renace"
                className="h-12 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              &copy; {new Date().getFullYear()} Casa Metropolitana de Movilidad
              Humana.
              <br />
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
