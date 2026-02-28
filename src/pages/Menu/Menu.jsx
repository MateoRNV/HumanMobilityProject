import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import AddUserModal from "./AddUserModal";
import UserDetailModal from "./UserDetailModal";
import "./menu.css";
import { personsApi } from "../../api/api.config";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/ui/Spinner/Spinner";

export const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.activeTab || "gestion-caso");
  const [searchUserBox, setSearchUserBox] = useState("");
  const [searchQuestionnaireBox, setSearchQuestionnaireBox] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [questionnaireList, setQuestionnaireList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await personsApi.getList();
      setUserList(data);
    } catch (err) {
      toast.error("Error al cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    try {
      const data = await personsApi.getDefinitions();
      setQuestionnaireList(data);
    } catch (err) {
      console.error("Error al cargar los cuestionarios", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchQuestionnaires();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const filteredUsers = userList.filter(
    (user) =>
      user.nombreCompleto
        ?.toLowerCase()
        .includes(searchUserBox.toLowerCase()) ||
      String(user.documento ?? "")
        .toLowerCase()
        .includes(searchUserBox.toLowerCase()) ||
      String(user.numeroCaso ?? "")
        .toLowerCase()
        .includes(searchUserBox.toLowerCase()),
  );

  const getQuestionnaireUI = (slug) => {
    const config = {
      triaje: {
        icon: "assignment",
        color: "text-blue-600 bg-blue-50 border-blue-100",
      },
      social: {
        icon: "group",
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      },
      legal: {
        icon: "balance",
        color: "text-amber-600 bg-amber-50 border-amber-100",
      },
      psicologico: {
        icon: "psychology",
        color: "text-purple-600 bg-purple-50 border-purple-100",
      },
    };
    return (
      config[slug] || {
        icon: "description",
        color: "text-gray-600 bg-gray-50 border-gray-100",
      }
    );
  };

  const filteredQuestionnaires = questionnaireList
    .map((q) => ({
      ...q,
      ...getQuestionnaireUI(q.slug),
    }))
    .filter(
      (q) =>
        q.nombre
          ?.toLowerCase()
          .includes(searchQuestionnaireBox.toLowerCase()) ||
        q.slug.toLowerCase().includes(searchQuestionnaireBox.toLowerCase()),
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
          <div
            className={`cursor-pointer pb-3 px-1 transition-colors ${
              tab === "gestion-cuestionarios"
                ? "active text-[var(--primary-color)]"
                : "hover:text-gray-800"
            }`}
            onClick={() => setTab("gestion-cuestionarios")}
          >
            Gestión de Cuestionarios
          </div>
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
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
      />
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
      {/* Gestion de Usuarios */}
      {tab === "gestion-caso" && (
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
          {isLoading ? (
            <div className="mt-12 flex justify-center w-full">
              <LoadingSpinner />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="user-list mt-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="user-card group cursor-pointer hover:bg-gray-50/80 transition-all border-l-4 border-l-transparent hover:border-l-[var(--primary-color)]"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-900 text-lg line-clamp-1">
                      {user.nombreCompleto}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-xs font-medium">
                        Caso {user.numeroCaso || "-"}
                      </span>
                      {user.documento && (
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">
                            badge
                          </span>
                          <span>{user.documento}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* {user.cuestionarios?.includes("triaje") && ( */}
                    <Link
                      to={`/formulario/triaje/${user.id}`}
                      state={{ user }}
                      className="h-10 w-10 flex items-center justify-center rounded-full border transition-all hover:shadow-md hover:-translate-y-0.5 bg-blue-50 text-blue-600 border-blue-100"
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
                      className="h-10 w-10 flex items-center justify-center rounded-full border transition-all hover:shadow-md hover:-translate-y-0.5 bg-emerald-50 text-emerald-600 border-emerald-100"
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
                      className="h-10 w-10 flex items-center justify-center rounded-full border transition-all hover:shadow-md hover:-translate-y-0.5 bg-amber-50 text-amber-600 border-amber-100"
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
                      className="h-10 w-10 flex items-center justify-center rounded-full border transition-all hover:shadow-md hover:-translate-y-0.5 bg-purple-50 text-purple-600 border-purple-100"
                      title="Cuestionario de Psicología"
                    >
                      <span className="material-symbols-outlined text-xl">
                        psychology
                      </span>
                    </Link>
                    {/* )} */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col mx-auto items-center mt-20 gap-4">
              <span className="material-symbols-outlined text-6xl text-gray-400">
                search_off
              </span>
              <div className="text-gray-500">No se encontraron usuarios</div>
            </div>
          )}
        </div>
      )}

      {/* Gestion de Cuestionarios */}
      {tab === "gestion-cuestionarios" && (
        <div
          className="flex flex-col items-start w-full max-w-5xl px-4 md:px-8 mt-8"
          style={{ flex: 1, minHeight: 0 }}
        >
          <div className="mb-3 font-semibold text-gray-800 text-lg">
            Directorio de Cuestionarios
          </div>
          <div className="relative w-full mb-6">
            <input
              type="text"
              placeholder={"Buscar por nombre o slug"}
              className="w-full pl-11 pr-4 py-3 rounded-md border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all shadow-sm bg-white text-gray-900"
              value={searchQuestionnaireBox}
              onChange={(e) => setSearchQuestionnaireBox(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
          </div>

          {filteredQuestionnaires.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {filteredQuestionnaires.map((q) => (
                <div
                  key={q.id}
                  onClick={() => navigate(`/editor/${q.slug}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all aspect-square"
                >
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-4 border ${q.color}`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {q.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {q.nombre}
                  </h3>
                  <div className="text-sm text-gray-500 mb-3 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    /{q.slug}
                  </div>
                  <div className="mt-2 px-4 py-1.5 bg-[var(--primary-color)] text-white text-xs font-semibold rounded-md shadow-sm opacity-90">
                    Versión {q.version}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col mx-auto items-center mt-20 gap-4">
              <span className="material-symbols-outlined text-6xl text-gray-400">
                search_off
              </span>
              <div className="text-gray-500">
                No se encontraron cuestionarios
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
