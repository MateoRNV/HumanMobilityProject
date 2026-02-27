import React from "react";

const TableView = ({ history, formSchema }) => {
  // Recolectar todos los campos del schema en orden
  const allFields = [];
  for (const section of formSchema?.sections || []) {
    for (const field of section.fields || []) {
      allFields.push({
        id: field.id,
        title: field.title,
        section: section.title,
      });
    }
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const renderValue = (answer) => {
    if (!answer) return <span className="text-gray-300">—</span>;
    const { valor, tipo, selecciones } = answer;
    if (
      tipo === "matrix" &&
      Array.isArray(selecciones) &&
      selecciones.length > 0
    ) {
      return selecciones.map((s) => `${s.fila}/${s.columna}`).join(", ");
    }
    if (Array.isArray(valor))
      return valor.join(", ") || <span className="text-gray-300">—</span>;
    if (typeof valor === "boolean") return valor ? "Sí" : "No";
    if (!valor && valor !== 0) return <span className="text-gray-300">—</span>;
    return String(valor);
  };

  if (history.length === 0 || allFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="material-symbols-outlined text-5xl mb-3">
          table_chart
        </span>
        <p className="text-sm">Sin datos para comparar</p>
      </div>
    );
  }

  // Construir índice: historyEntry -> mapa campoId -> answer
  const answerMaps = history.map((entry) => {
    const map = {};
    for (const answer of entry.respuestas || []) {
      map[answer.campoId] = answer;
    }
    return map;
  });

  return (
    <div className="overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[#273a71] text-white">
            <th className="text-left px-4 py-3 font-semibold sticky left-0 bg-[#273a71] min-w-[200px] z-10">
              Campo
            </th>
            {history.map((entry, idx) => (
              <th
                key={entry.id}
                className="px-4 py-3 font-semibold text-center min-w-[120px]"
              >
                <div>{formatDate(entry.fecha)}</div>
                <div className="text-blue-200 font-normal text-[10px]">
                  v{entry.versionCuestionario}
                  {idx === 0 ? " · actual" : ""}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFields.map((field, rowIdx) => (
            <tr
              key={field.id}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td
                className={`px-4 py-2.5 font-medium text-gray-700 sticky left-0 z-10 border-r border-gray-200 ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                {field.title}
              </td>
              {answerMaps.map((map, colIdx) => (
                <td
                  key={colIdx}
                  className="px-4 py-2.5 text-gray-600 text-center border-b border-gray-100"
                >
                  {renderValue(map[field.id])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
