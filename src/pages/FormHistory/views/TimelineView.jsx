import React, { useState } from "react";

const TimelineView = ({ history, formSchema }) => {
  const [openIds, setOpenIds] = useState({});

  // Mapa campoId -> definición completa del campo (para acceder a columns, etc.)
  const fieldMap = {};
  for (const section of formSchema?.sections || []) {
    for (const field of section.fields || []) {
      fieldMap[field.id] = field;
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

  const renderValue = (answer, field) => {
    const { valor, tipo, selecciones } = answer;

    if (
      tipo === "matrix" &&
      Array.isArray(selecciones) &&
      selecciones.length > 0
    ) {
      return selecciones.map((s) => `${s.fila} / ${s.columna}`).join(", ");
    }

    if (
      tipo === "table" ||
      (Array.isArray(valor) &&
        valor.length > 0 &&
        valor[0] !== null &&
        typeof valor[0] === "object")
    ) {
      if (!Array.isArray(valor) || valor.length === 0) return "Sin filas";
      const columns = field?.columns || [];
      if (columns.length === 0) return `${valor.length} fila(s)`;
      return (
        <div className="overflow-x-auto mt-1 rounded-lg border border-gray-200">
          <table className="text-xs border-collapse min-w-full">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="border-b border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap text-left"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {valor.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="border-b border-gray-100 last:border-b-0 px-3 py-1.5 text-gray-700"
                    >
                      {row[col.id] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
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

  const toggleOpen = (id) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-3">
      {history.map((entry, idx) => {
        const isOpen = !!openIds[entry.id];
        const visibleAnswers = (entry.respuestas || []).filter(
          (a) => !a._orphaned,
        );
        return (
          <div
            key={entry.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleOpen(entry.id)}
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
                  {visibleAnswers.map((answer) => {
                    const field = fieldMap[answer.campoId];
                    const rendered = renderValue(answer, field);
                    const isComplex =
                      typeof rendered === "object" && rendered !== null;

                    if (isComplex) {
                      return (
                        <div
                          key={answer.campoId}
                          className="py-2 border-b border-gray-50 last:border-0 flex flex-col gap-1"
                        >
                          <span className="text-xs font-medium text-gray-500">
                            {field?.title || answer.campoId}
                          </span>
                          <div className="text-xs text-gray-800">
                            {rendered}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={answer.campoId}
                        className="grid grid-cols-2 gap-4 py-2 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-xs font-medium text-gray-500">
                          {field?.title || answer.campoId}
                        </span>
                        <span className="text-xs text-gray-800 font-medium">
                          {rendered}
                        </span>
                      </div>
                    );
                  })}
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
