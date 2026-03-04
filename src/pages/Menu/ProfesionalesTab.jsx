import { useState, useEffect } from "react";
import { profesionalesApi } from "../../api/api.config";
import { useAuth } from "../../context/AuthContext";
import AddProfesionalModal from "./AddProfesionalModal";
import LoadingSpinner from "../../components/ui/Spinner/Spinner";
import toast from "react-hot-toast";

const ROL_LABELS = {
  admin: "Administrador",
  trabajador_social: "Trabajador Social",
  psicologo: "Psicólogo",
  abogado: "Abogado",
  consulta: "Consulta",
};

const ROL_COLORS = {
  admin: "bg-red-50 text-red-700 border-red-200",
  trabajador_social: "bg-emerald-50 text-emerald-700 border-emerald-200",
  psicologo: "bg-purple-50 text-purple-700 border-purple-200",
  abogado: "bg-amber-50 text-amber-700 border-amber-200",
  consulta: "bg-gray-100 text-gray-600 border-gray-200",
};

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "trabajador_social", label: "Trabajador Social" },
  { value: "psicologo", label: "Psicólogo" },
  { value: "abogado", label: "Abogado" },
  { value: "consulta", label: "Consulta" },
];

export default function ProfesionalesTab() {
  const { profesional: me } = useAuth();
  const [profesionales, setProfesionales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(null);

  const fetchProfesionales = async () => {
    setIsLoading(true);
    try {
      const data = await profesionalesApi.getAll();
      setProfesionales(data);
    } catch (err) {
      toast.error("Error al cargar los profesionales");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const handleRolChange = async (id, newRol) => {
    setUpdating(id);
    try {
      const updated = await profesionalesApi.update(id, { rol: newRol });
      setProfesionales((prev) =>
        prev.map((p) => (p.id === id ? { ...p, rol: updated.rol } : p))
      );
      toast.success("Rol actualizado");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleActivo = async (id, currentActivo) => {
    if (id === me?.id) {
      toast.error("No puedes desactivar tu propia cuenta");
      return;
    }
    setUpdating(id);
    try {
      const updated = await profesionalesApi.update(id, { activo: !currentActivo });
      setProfesionales((prev) =>
        prev.map((p) => (p.id === id ? { ...p, activo: updated.activo } : p))
      );
      toast.success(updated.activo ? "Profesional activado" : "Profesional desactivado");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = profesionales.filter(
    (p) =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-start w-full max-w-5xl px-4 md:px-8 mt-8">
      <AddProfesionalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProfesionales}
      />

      <div className="flex items-center justify-between w-full mb-3">
        <div className="font-semibold text-gray-800 text-lg">
          Directorio de Profesionales
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--primary-color)] border border-[var(--primary-color)] text-white hover:bg-[#1e2d5c] shadow-sm font-medium py-2 px-5 rounded-md transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Profesional
        </button>
      </div>

      <div className="relative w-full mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          className="w-full pl-11 pr-4 py-3 rounded-md border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all shadow-sm bg-white text-gray-900"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
      </div>

      {isLoading ? (
        <div className="mt-12 flex justify-center w-full">
          <LoadingSpinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col mx-auto items-center mt-20 gap-4">
          <span className="material-symbols-outlined text-6xl text-gray-400">
            group_off
          </span>
          <div className="text-gray-500">No se encontraron profesionales</div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          {filtered.map((p) => {
            const isMe = p.id === me?.id;
            const isUpdating = updating === p.id;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between gap-4 px-5 py-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-opacity ${
                  !p.activo ? "opacity-50" : ""
                }`}
              >
                {/* Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center font-semibold text-sm shrink-0">
                    {p.nombre[0]}
                    {p.apellido[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {p.nombre} {p.apellido}
                      {isMe && (
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          (tú)
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{p.email}</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Rol selector */}
                  <select
                    value={p.rol}
                    disabled={isUpdating}
                    onChange={(e) => handleRolChange(p.id, e.target.value)}
                    className={`text-sm border rounded-md px-2 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      ROL_COLORS[p.rol]
                    } disabled:cursor-not-allowed`}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>

                  {/* Activo toggle */}
                  <button
                    disabled={isUpdating || isMe}
                    onClick={() => handleToggleActivo(p.id, p.activo)}
                    title={
                      isMe
                        ? "No puedes desactivar tu propia cuenta"
                        : p.activo
                        ? "Desactivar"
                        : "Activar"
                    }
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      p.activo
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {p.activo ? "check_circle" : "cancel"}
                    </span>
                    {p.activo ? "Activo" : "Inactivo"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
