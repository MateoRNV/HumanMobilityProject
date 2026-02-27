import React, { useState } from "react";
import { FormRender } from "../../../features/forms/FormRender";

const FormView = ({ history, formSchema }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="material-symbols-outlined text-5xl mb-3">history</span>
        <p className="text-sm">Sin registros guardados</p>
      </div>
    );
  }

  const selected = history[selectedIdx];

  return (
    <div className="flex gap-4 h-full">
      {/* Panel izquierdo: lista de snapshots */}
      <div className="w-48 flex-shrink-0 space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">
          Fecha de guardado
        </p>
        {history.map((entry, idx) => (
          <button
            key={entry.id}
            onClick={() => setSelectedIdx(idx)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
              selectedIdx === idx
                ? "bg-[#273a71] text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="text-xs font-semibold">
              {formatDate(entry.fecha)}
            </div>
            <div
              className={`text-[10px] mt-0.5 ${
                selectedIdx === idx ? "text-blue-200" : "text-gray-400"
              }`}
            >
              v{entry.versionCuestionario}
              {idx === 0 ? " · actual" : ""}
            </div>
          </button>
        ))}
      </div>

      {/* Divisor */}
      <div className="w-px bg-gray-200 flex-shrink-0" />

      {/* Panel derecho: formulario read-only */}
      <div className="flex-1 overflow-auto">
        <FormRender
          key={selected?.id || "empty"}
          formSchema={formSchema}
          initialAnswers={selected?.respuestas || []}
          isPreview={true}
        />
      </div>
    </div>
  );
};

export default FormView;
