import React, { useState } from "react";

const TimelineView = ({ history, formSchema }) => {
  const [openId, setOpenId] = useState(null);

  // Construye un mapa campoId -> título del campo usando el schema actual
  const fieldTitles = {};
  for (const section of formSchema?.sections || []) {
    for (const field of section.fields || []) {
      fieldTitles[field.id] = field.title;
    }
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderValue = (answer) => {
    const { valor, tipo, selecciones } = answer;
    if (
      tipo === "matrix" &&
      Array.isArray(selecciones) &&
      selecciones.length > 0
    ) {
      return selecciones.map((s) => `${s.fila} / ${s.columna}`).join(", ");
    }
    if (Array.isArray(valor)) return valor.join(", ");
    if (typeof valor === "boolean") return valor ? "Sí" : "No";
    return valor ?? "—";
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="material-symbols-outlined text-5xl mb-3">history</span>
        <p className="text-sm">Sin registros guardados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry, idx) => {
        const isOpen = openId === entry.id;
        const visibleAnswers = (entry.respuestas || []).filter(
          (a) => !a._orphaned,
        );
        return (
          <div
            key={entry.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : entry.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {idx === 0 && (
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Más reciente
                  </span>
                )}
                <span className="text-sm font-semibold text-gray-800">
                  {formatDate(entry.fecha)}
                </span>
                <span className="text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                  v{entry.versionCuestionario}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xs">
                  {visibleAnswers.length} respuestas
                </span>
                <span
                  className="material-symbols-outlined text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                >
                  expand_more
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="space-y-2">
                  {visibleAnswers.map((answer) => (
                    <div
                      key={answer.campoId}
                      className="grid grid-cols-2 gap-4 py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-xs font-medium text-gray-500">
                        {fieldTitles[answer.campoId] ?? answer.campoId}
                      </span>
                      <span className="text-xs text-gray-800 font-medium">
                        {renderValue(answer)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimelineView;
