import React, { useMemo, useCallback } from "react";

/**
 * MatrixInput
 * - Renderiza una matriz de checkboxes (varias columnas por fila).
 * - Componente controlado: recibe un objeto "value" de la forma { [rowValue]: [colValue, ...] }
 * - Para compatibilidad también acepta la prop "selections" (array de {row, column}) y la convierte.
 */
export const MatrixInput = ({ field, value, selections, onChange = () => {} }) => {
  // 1. Separar header y filas de datos
  const headerDefinition = useMemo(
    () => field.rows.find(row => row.isHeader),
    [field.rows]
  );
  const dataRows = useMemo(
    () => field.rows.filter(row => !row.isHeader),
    [field.rows]
  );

  // 2. Normalizar el objeto de selecciones por fila
  const rowSelections = useMemo(() => {
    // Caso principal: value controlado
    if (value && typeof value === "object") {
      const normalized = {};
      for (const rowKey in value) {
        normalized[rowKey] = Array.isArray(value[rowKey]) ? value[rowKey] : [];
      }
      return normalized;
    }
    // Caso legado: venir con selections (array)
    if (Array.isArray(selections)) {
      const selectionMap = {};
      for (const { row, column } of selections) {
        if (!Array.isArray(selectionMap[row])) selectionMap[row] = [];
        if (!selectionMap[row].includes(column)) selectionMap[row].push(column);
      }
      return selectionMap;
    }
    return {};
  }, [value, selections]);

  // 3. Toggle de una celda
  const toggleCell = useCallback((rowValue, colValue) => {
    const current = rowSelections[rowValue] || [];
    const nextForRow = current.includes(colValue)
      ? current.filter(v => v !== colValue)
      : [...current, colValue];
    onChange({ ...rowSelections, [rowValue]: nextForRow });
  }, [rowSelections, onChange]);

  const nameBase = field.code || field.id || "matrix";

  return (
    <div className="w-full max-w-3xl mx-auto">
      {field.title && (
        <div className="flex items-center w-1/2 py-3">
          {typeof field.order !== "undefined" && (
            <div className="me-3">{`${field.order})`}</div>
          )}
          <div>{field.title}</div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left font-medium px-4 py-3 w-[45%]">
                {headerDefinition?.label || ""}
              </th>
              {field.columns.map((col) => (
                <th key={col.value} className="font-medium px-4 py-3 text-center">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row) => (
              <tr key={row.value} className="odd:bg-white even:bg-gray-50/60">
                <td className="px-4 py-3 align-middle text-gray-800">
                  {row.label}
                </td>
                {field.columns.map((col) => {
                  const selectedCols = rowSelections[row.value] || [];
                  const checked = selectedCols.includes(col.value);
                  return (
                    <td key={col.value} className="px-4 py-3 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name={`matrix-${nameBase}-${row.value}`}
                          value={col.value}
                          checked={checked}
                          onChange={() => toggleCell(row.value, col.value)}
                          className="h-4 w-4 accent-black"
                          aria-label={`${row.label}: ${col.label}`}
                        />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
