import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Modal from "../../../components/Modal/Modal";
import { personsApi } from "../../../api.config";
import toast from "react-hot-toast";
import "./UserDetailModal.css";

const UserDetailModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // States for Info
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");

  // States for Contacts (Dynamic)
  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || user.nombreCompleto?.split(" ")[0] || "");
      setApellido(
        user.apellido ||
          user.nombreCompleto?.split(" ").slice(1).join(" ") ||
          "",
      );
      setDocumento(user.documento || "");

      let parsedContacts = [];
      if (user.contactos) {
        if (typeof user.contactos === "string") {
          try {
            parsedContacts = JSON.parse(user.contactos);
          } catch (e) {
            console.error("Error parsing contactos", e);
          }
        } else if (Array.isArray(user.contactos)) {
          parsedContacts = user.contactos;
        }
      }

      setPhones(parsedContacts.filter((c) => c.tipo === "telefono"));
      setEmails(parsedContacts.filter((c) => c.tipo === "email"));
      setIsEditing(false);
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const allContacts = [...phones, ...emails].filter(
        (c) => c.valor.trim() !== "",
      );

      await personsApi.update(user.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        documento: documento.trim() || null,
        contactos: allContacts,
      });
      toast.success("Usuario actualizado correctamente");
      setIsEditing(false);
      onSuccess?.();
    } catch (err) {
      toast.error(
        "Error al actualizar: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addPhone = () =>
    setPhones([
      ...phones,
      { tipo: "telefono", valor: "", etiqueta: "Personal" },
    ]);
  const updatePhone = (index, field, val) => {
    const list = [...phones];
    list[index][field] = val;
    setPhones(list);
  };
  const removePhone = (index) =>
    setPhones(phones.filter((_, i) => i !== index));

  const addEmail = () =>
    setEmails([...emails, { tipo: "email", valor: "", etiqueta: "Personal" }]);
  const updateEmail = (index, field, val) => {
    const list = [...emails];
    list[index][field] = val;
    setEmails(list);
  };
  const removeEmail = (index) =>
    setEmails(emails.filter((_, i) => i !== index));

  const questionnaires = [
    {
      name: "Triaje",
      slug: "triaje",
      icon: "assignment",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      name: "Social",
      slug: "social",
      icon: "group",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      name: "Legal",
      slug: "legal",
      icon: "balance",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      name: "Psicología",
      slug: "psicologico",
      icon: "psychology",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={{
        title: isEditing
          ? "Editar Detalles de Usuario"
          : "Detalles del Usuario",
        icon: isEditing ? "edit_note" : "person",
      }}
      isLoading={isLoading}
      width="800px"
    >
      <div className="user-detail-content overflow-y-auto max-h-[70vh] pr-2">
        {/* Basic Info Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Información General
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-color)] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Editar
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                Nombre Completo
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Apellido"
                  />
                </div>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {user.nombreCompleto}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                Número de Caso
              </label>
              <div className="flex items-center gap-2">
                <span className="bg-red-50 border border-red-200 px-3 py-1 rounded-full text-sm font-bold text-[#d72836]">
                  {user.numeroCaso || "Sin asignar"}
                </span>
                <span
                  className="material-symbols-outlined text-gray-400 text-sm"
                  title="Solo lectura"
                >
                  lock
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                Documento de Identidad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Número de documento"
                />
              ) : (
                <p className="text-gray-700 font-medium">
                  {user.documento || "No proporcionado"}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Contacts */}
        <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
            Contactos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phones */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    phone
                  </span>{" "}
                  Teléfonos
                </label>
                {isEditing && (
                  <button
                    onClick={addPhone}
                    className="text-blue-600 text-xs font-bold hover:underline"
                  >
                    + Añadir
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {phones.length > 0
                  ? phones.map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={phone.etiqueta}
                              onChange={(e) =>
                                updatePhone(idx, "etiqueta", e.target.value)
                              }
                              className="w-[100px] p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej. Casa"
                            />
                            <input
                              type="text"
                              value={phone.valor}
                              onChange={(e) =>
                                updatePhone(idx, "valor", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Número..."
                            />
                            <button
                              onClick={() => removePhone(idx)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 py-1 px-2 bg-gray-50 rounded border border-gray-100 flex items-center gap-2">
                            {phone.etiqueta && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                {phone.etiqueta}
                              </span>
                            )}
                            <p className="text-sm text-gray-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                              {phone.valor}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  : !isEditing && (
                      <p className="text-xs italic text-gray-400">
                        Sin teléfonos registrados
                      </p>
                    )}
              </div>
            </div>

            {/* Emails */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    mail
                  </span>{" "}
                  Correos
                </label>
                {isEditing && (
                  <button
                    onClick={addEmail}
                    className="text-blue-600 text-xs font-bold hover:underline"
                  >
                    + Añadir
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {emails.length > 0
                  ? emails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={email.etiqueta}
                              onChange={(e) =>
                                updateEmail(idx, "etiqueta", e.target.value)
                              }
                              className="w-[100px] p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ej. Personal"
                            />
                            <input
                              type="email"
                              value={email.valor}
                              onChange={(e) =>
                                updateEmail(idx, "valor", e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="correo@ejemplo.com"
                            />
                            <button
                              onClick={() => removeEmail(idx)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 py-1 px-2 bg-gray-50 rounded border border-gray-100 flex items-center gap-2">
                            {email.etiqueta && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                {email.etiqueta}
                              </span>
                            )}
                            <p className="text-sm text-gray-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                              {email.valor}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  : !isEditing && (
                      <p className="text-xs italic text-gray-400">
                        Sin correos registrados
                      </p>
                    )}
              </div>
            </div>
          </div>
        </section>

        {/* Questionnaires Section */}
        {!isEditing && (
          <section className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Acceso a Cuestionarios
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {questionnaires.map((q) => (
                <Link
                  key={q.slug}
                  to={`/formulario/${q.slug}/${user.id}`}
                  state={{ user }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${q.color}`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {q.icon}
                  </span>
                  <span className="text-xs font-bold">{q.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* History Placeholder */}
        {/* {!isEditing && (
          <section className="mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Historial de Respuestas
            </h3>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
                history
              </span>
              <p className="text-sm text-gray-500">
                Próximamente: Consulta el histórico de cambios y respuestas de
                este usuario.
              </p>
              <button className="mt-4 text-xs font-bold text-gray-400 cursor-not-allowed uppercase tracking-widest">
                Ver Historial Completo
              </button>
            </div>
          </section>
        )} */}

        {/* Actions for Editing */}
        {isEditing && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !nombre.trim() || !apellido.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-[var(--primary-color)] text-white font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(39,54,124,0.39)]"
            >
              {isLoading ? (
                "Guardando..."
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    save
                  </span>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserDetailModal;
