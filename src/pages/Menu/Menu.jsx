import React, { useState } from "react";
import { Link } from "react-router";
import Select from "react-select";
import "./menu.css";
import { users } from "../../apis/users-api";

export const Menu = () => {
  const [tab, setTab] = useState("gestion-caso");
  const [searchUserBox, setSearchUserBox] = useState("");

  return (
    <div className="flex flex-col h-full  items-center">
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
          <button className="primary-button">Adicionar Servicio</button>
        )}
        {tab === "talleres" && (
          <button className="primary-button">Adicionar Taller</button>
        )}
      </div>
      {/* Gestion de Usuarios */}
      <div
        className="flex flex-col items-start w-full px-20"
        style={{ flex: 1, minHeight: 0 }}
      >
        <div className="mb-2">Busqueda de Usuarios</div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder={"Buscar por nombre o documento"}
            className="w-full pl-4 pr-12 py-2 rounded-md border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all shadow-sm"
            value={searchUserBox}
            onChange={(e) => setSearchUserBox(e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors">
            search
          </span>
        </div>
        <div className="user-list mt-4">
          {users
            .filter(
              (user) =>
                user.name.toLowerCase().includes(searchUserBox.toLowerCase()) ||
                user.document
                  .toLowerCase()
                  .includes(searchUserBox.toLowerCase())
            )
            .map((user) => (
              <div key={user.id} className="user-card">
                <div>
                  {user.name} - {user.document}
                </div>
                <div className="flex gap-4">
                  {user.triage && (
                    <Link
                      to={`/triaje/${user.id}`}
                      state={{ user }} // <-- pasa objeto user para prefill
                      className="material-symbols-outlined cursor-pointer"
                      title="Cuestionario de Triaje"
                    >
                      assignment
                    </Link>
                  )}
                  {user.socialWork && (
                    <Link
                      to={`/trabajo-social/${user.id}`}
                      state={{ user }}
                      className="material-symbols-outlined cursor-pointer"
                      title="Cuestionario de Trabajo Social"
                    >
                      group
                    </Link>
                  )}
                  <Link
                    to={`/legal/${user.id}`}
                    state={{ user }}
                    className="material-symbols-outlined cursor-pointer"
                    title="Cuestionario Legal"
                  >
                    balance
                  </Link>
                  {/* {user.psychological && ( */}
                  <Link
                    to={`/psicologico/${user.id}`}
                    state={{ user }}
                    className="material-symbols-outlined cursor-pointer"
                    title="Cuestionario de Psicología"
                  >
                    psychology
                  </Link>
                  {/* )} */}
                </div>
              </div>
            ))}

          {users.filter(
            (user) =>
              user.name.toLowerCase().includes(searchUserBox.toLowerCase()) ||
              user.document.toLowerCase().includes(searchUserBox.toLowerCase())
          ).length === 0 && (
            <div className="flex flex-col items-center mt-20 gap-4">
              <span className="material-symbols-outlined text-6xl text-gray-400">
                search_off
              </span>
              <div className="text-gray-500">No se encontraron usuarios</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
