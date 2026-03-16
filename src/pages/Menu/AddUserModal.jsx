import React, { useState } from "react";
import Modal from "../../components/ui/Modal/Modal";
import { personsApi } from "../../api/api.config";
import toast from "react-hot-toast";
import "./AddUserModal.css";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [document, setDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("El nombre es obligatorio");
      return;
    }

    setIsLoading(true);
    try {
      await personsApi.create({
        nombre: trimmedName,
        apellido: lastName,
        documento: document.trim() || null,
      });
      toast.success(`Usuario ${trimmedName} ${lastName} creado con éxito`);
      setName("");
      setLastName("");
      setDocument("");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(
        "Error al crear el usuario: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setDocument("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={{
        title: "Nuevo Registro de Usuario",
        icon: "person_add",
      }}
      isLoading={isLoading}
    >
      <div className="add-user-modal-content">
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-group">
            <label htmlFor="user-name">
              Nombre<span className="required-mark">*</span>
            </label>
            <div className={`input-wrapper ${name ? "has-value" : ""}`}>
              <span className="material-symbols-outlined notranslate input-icon">
                person
              </span>
              <input
                id="user-name"
                type="text"
                placeholder="Ej. Juan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                autoFocus
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user-name">
              Apellido <span className="required-mark">*</span>
            </label>
            <div className={`input-wrapper ${lastName ? "has-value" : ""}`}>
              <span className="material-symbols-outlined notranslate input-icon">
                person
              </span>
              <input
                id="user-lastName"
                type="text"
                placeholder="Ej. Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                autoFocus
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user-doc">Número de Identificación</label>
            <div className={`input-wrapper ${document ? "has-value" : ""}`}>
              <span className="material-symbols-outlined notranslate input-icon">
                badge
              </span>
              <input
                id="user-doc"
                type="text"
                placeholder="Nro. de documento (opcional)"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !name.trim() || !lastName.trim()}
            >
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined notranslate">how_to_reg</span>
                  <span>Registrar Usuario</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddUserModal;
