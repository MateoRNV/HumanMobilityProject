import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Modal from "../../components/Modal/Modal";
import "./menu.css";
import { personsApi } from "../../api.config";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/Spinner/Spinner";

export const Menu = () => {
  const [tab, setTab] = useState("gestion-caso");
  const [searchUserBox, setSearchUserBox] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserDocument, setNewUserDocument] = useState("");
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await personsApi.getList();
      setUserList(data);
    } catch (err) {
      toast.error("Error al cargar los usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const name = newUserName.trim();
    if (!name) return;

    setIsLoading(true);
    try {
      await personsApi.create({
        nombre: name,
        documento: newUserDocument.trim() || null,
      });
      setNewUserName("");
      setNewUserDocument("");
      setIsModalOpen(false);
      fetchUsers();
      toast.success(`Usuario ${name} creado con éxito`);
    } catch (err) {
      toast.error("Error al crear el usuario: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = userList.filter(
    (user) =>
      user.nombre?.toLowerCase().includes(searchUserBox.toLowerCase()) ||
      String(user.documento ?? "")
        .toLowerCase()
        .includes(searchUserBox.toLowerCase()) ||
      String(user.numeroCaso ?? "")
        .toLowerCase()
        .includes(searchUserBox.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center font-sans text-gray-900 pb-10">
      {/* Tabs */}
      <div className="flex w-full max-w-5xl justify-between items-center px-4 md:px-8 mt-8 border-b border-gray-200">
        <div className="flex justify-start gap-8 text-lg font-medium text-gray-500">
          <div
            className={`cursor-pointer pb-3 px-1 transition-colors ${
              tab === "gestion-caso"
                ? "active text-[var(--primary-color)]"
                : "hover:text-gray-800"
            }`}
            onClick={() => setTab("gestion-caso")}
          >
            Gestión de Casos
          </div>
          {/*
          <div
            className={`cursor-pointer pb-3 px-1 transition-colors ${
              tab === "talleres" ? "active text-[var(--primary-color)]" : "hover:text-gray-800"
            }`}
            onClick={() => setTab("talleres")}
          >
            Talleres
          </div>
          */}
        </div>
        <div className="pb-3">
          {tab === "gestion-caso" && (
            <button
              className="bg-[var(--primary-color)] border border-[var(--primary-color)] text-white hover:bg-[#1e2d5c] shadow-sm font-medium py-2 px-5 rounded-md transition-colors flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Nuevo Usuario
            </button>
          )}
          {/* tab === "talleres" && (
            <button className="bg-[var(--primary-color)] text-white hover:bg-[#1e2d5c] shadow-sm font-medium py-2 px-5 rounded-md transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Adicionar Taller
            </button>
          )*/}
        </div>
      </div>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header={{ title: "Adicionar Servicio" }}
        isLoading={isLoading}
      >
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center py-10">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-semibold text-gray-700">
                  Nombre Completo <span className="text-[#d72836]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el nombre del usuario"
                  className="w-full pl-4 pr-4 py-2.5 rounded-md border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all shadow-sm"
                  value={newUserName}
                  disabled={isLoading}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-sm font-semibold text-gray-700">
                  Identificación
                </label>
                <input
                  type="text"
                  placeholder="Nro. de documento (opcional)"
                  className="w-full pl-4 pr-4 py-2.5 rounded-md border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all shadow-sm"
                  value={newUserDocument}
                  disabled={isLoading}
                  onChange={(e) => setNewUserDocument(e.target.value)}
                />
              </div>
              <button
                className="bg-[var(--primary-color)] text-white font-medium mt-2 py-2.5 px-4 rounded-md shadow-sm border border-transparent hover:bg-[#1e2d5c] focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] disabled:bg-gray-400 transition-colors w-full"
                onClick={handleAddUser}
                disabled={isLoading}
              >
                Registrar Usuario
              </button>
            </>
          )}
        </div>
      </Modal>
      {/* Gestion de Usuarios */}
      <div
        className="flex flex-col items-start w-full max-w-5xl px-4 md:px-8 mt-8"
        style={{ flex: 1, minHeight: 0 }}
      >
        <div className="mb-3 font-semibold text-gray-800 text-lg">
          Directorio de Usuarios
        </div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder={"Buscar por nombre, documento o número de caso"}
            className="w-full pl-11 pr-4 py-3 rounded-md border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all shadow-sm bg-white text-gray-900"
            value={searchUserBox}
            onChange={(e) => setSearchUserBox(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
        </div>

        <div className="user-list mt-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="user-card group">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-lg line-clamp-1">
                    {user.nombre}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-xs">
                      Caso {user.numeroCaso || "-"}
                    </span>
                    {user.documento && <span>ID: {user.documento}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* {user.cuestionarios?.includes("triaje") && ( */}
                  <Link
                    to={`/formulario/triaje/${user.id}`}
                    state={{ user }}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 border border-gray-200 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] hover:bg-[#e9f1f9] transition-all shadow-sm"
                    title="Cuestionario de Triaje"
                  >
                    <span className="material-symbols-outlined text-xl">
                      assignment
                    </span>
                  </Link>
                  {/* )} */}

                  {/* {user.cuestionarios?.includes("social") && ( */}
                  <Link
                    to={`/formulario/social/${user.id}`}
                    state={{ user }}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 border border-gray-200 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] hover:bg-[#e9f1f9] transition-all shadow-sm"
                    title="Cuestionario de Trabajo Social"
                  >
                    <span className="material-symbols-outlined text-xl">
                      group
                    </span>
                  </Link>
                  {/* )} */}

                  {/* {user.cuestionarios?.includes("legal") && ( */}
                  <Link
                    to={`/formulario/legal/${user.id}`}
                    state={{ user }}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 border border-gray-200 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] hover:bg-[#e9f1f9] transition-all shadow-sm"
                    title="Cuestionario Legal"
                  >
                    <span className="material-symbols-outlined text-xl">
                      balance
                    </span>
                  </Link>
                  {/* )} */}

                  {/* {user.cuestionarios?.includes("psicologico") && ( */}
                  <Link
                    to={`/formulario/psicologico/${user.id}`}
                    state={{ user }}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-400 border border-gray-200 hover:text-[var(--primary-color)] hover:border-[var(--primary-color)] hover:bg-[#e9f1f9] transition-all shadow-sm"
                    title="Cuestionario de Psicología"
                  >
                    <span className="material-symbols-outlined text-xl">
                      psychology
                    </span>
                  </Link>
                  {/* )} */}
                </div>
              </div>
            ))
          )}
        </div>
        {filteredUsers.length === 0 && (
          <div className="flex flex-col mx-auto items-center mt-20 gap-4">
            <span className="material-symbols-outlined text-6xl text-gray-400">
              search_off
            </span>
            <div className="text-gray-500">No se encontraron usuarios</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
