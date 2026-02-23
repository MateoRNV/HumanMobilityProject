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
    <div className="flex flex-col h-full items-center">
      {/* Tabs */}
      <div className="flex w-full justify-between items-center px-20">
        <div className="flex justify-start gap-5 my-10 text-xl">
          <div
            className={`cursor-pointer menu-item ${
              tab === "gestion-caso" ? "active" : ""
            }`}
            onClick={() => setTab("gestion-caso")}
          >
            Gestión de caso
          </div>
          <div
            className={`cursor-pointer menu-item ${
              tab === "talleres" ? "active" : ""
            }`}
            onClick={() => setTab("talleres")}
          >
            Talleres
          </div>
        </div>
        {tab === "gestion-caso" && (
          <button
            className="primary-button"
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar Usuario
          </button>
        )}
        {tab === "talleres" && (
          <button className="primary-button">Adicionar Taller</button>
        )}
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
              <input
                type="text"
                placeholder="Ingrese el nombre del usuario"
                className="w-full pl-4 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all shadow-sm"
                value={newUserName}
                disabled={isLoading}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ingrese el número de identificación (opcional)"
                className="w-full pl-4 pr-4 py-2 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all shadow-sm"
                value={newUserDocument}
                disabled={isLoading}
                onChange={(e) => setNewUserDocument(e.target.value)}
              />
              <button
                className="primary-button"
                onClick={handleAddUser}
                disabled={isLoading}
              >
                Adicionar
              </button>
            </>
          )}
        </div>
      </Modal>
      {/* Gestion de Usuarios */}
      <div
        className="flex flex-col items-start w-full px-20"
        style={{ flex: 1, minHeight: 0 }}
      >
        <div className="mb-2">Busqueda de Usuarios</div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder={"Buscar por nombre, documento o numero de caso"}
            className="w-full pl-4 pr-12 py-2 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all shadow-sm"
            value={searchUserBox}
            onChange={(e) => setSearchUserBox(e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            search
          </span>
        </div>

        <div className="user-list mt-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div>
                  {user.nombre} {user.documento ? ` - ${user.documento}` : ""}
                </div>
                <div className="flex gap-4">
                  {/* {user.cuestionarios?.includes("triaje") && ( */}
                  <Link
                    to={`/formulario/triaje/${user.id}`}
                    state={{ user }}
                    className="material-symbols-outlined cursor-pointer"
                    title="Cuestionario de Triaje"
                  >
                    assignment
                  </Link>
                  {/* )} */}

                  {/* {user.cuestionarios?.includes("social") && ( */}
                  <Link
                    to={`/formulario/social/${user.id}`}
                    state={{ user }}
                    className="material-symbols-outlined cursor-pointer"
                    title="Cuestionario de Trabajo Social"
                  >
                    group
                  </Link>
                  {/* )} */}

                  {/* {user.cuestionarios?.includes("legal") && ( */}
                  <Link
                    to={`/formulario/legal/${user.id}`}
                    state={{ user }}
                    className="material-symbols-outlined cursor-pointer"
                    title="Cuestionario Legal"
                  >
                    balance
                  </Link>
                  {/* )} */}

                  {/* {user.cuestionarios?.includes("psicologico") && ( */}
                  <Link
                    to={`/formulario/psicologico/${user.id}`}
                    state={{ user }}
                    className="material-symbols-outlined cursor-pointer"
                    title="Cuestionario de Psicología"
                  >
                    psychology
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
