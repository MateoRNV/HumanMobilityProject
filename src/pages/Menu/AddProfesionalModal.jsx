import { useState } from "react";
import { profesionalesApi } from "../../api/api.config";
import toast from "react-hot-toast";

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "trabajador_social", label: "Trabajador Social" },
  { value: "psicologo", label: "Psicólogo" },
  { value: "abogado", label: "Abogado" },
  { value: "consulta", label: "Consulta" },
];

export default function AddProfesionalModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "consulta",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await profesionalesApi.register(form);
      toast.success("Profesional registrado correctamente");
      setForm({ nombre: "", apellido: "", email: "", password: "", rol: "consulta" });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Nuevo profesional</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Nombre
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Juan"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Apellido
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                placeholder="Pérez"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Correo electrónico
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="profesional@mdmq.gob.ec"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Rol
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] disabled:opacity-60 transition-colors"
            >
              {submitting ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
