import React from "react";
import { Link } from "react-router";

export default function Home() {
  return (
    <div
      className="flex flex-col h-full text-center justify-center items-center"
      style={{ padding: "24px 20rem" }}
    >
      <h1 className="text-5xl font-bold" style={{ color: "#27367c" }}>
        Sistema de Registro de Casos
      </h1>
      <img
        src="/assets/img/logoCasaSinFronteras.svg"
        alt="Casa sin Fronteras"
        srcset=""
        width={950}
        height={950}
      />
      <div className="flex w-full justify-end">
        <button className="bg-blue-500 text-white px-5 py-3 rounded mt-4 hover:bg-blue-600">
          <Link to="/menu">Inicio</Link>
        </button>
      </div>
    </div>
  );
}
