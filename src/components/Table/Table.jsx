import React, { useState } from "react";

export const Table = ({
  columns,
  data = [],
  onChange,
  allowAddRows,
  canDeleteRows,
  addRowText,
}) => {
  const [rows, setRows] = useState(data);

  const handleCellChange = (rowIndex, columnId, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnId]: value };
    setRows(updatedRows);
    onChange?.(updatedRows);
  };

  const handleAddRow = () => {
    const newRow = columns.reduce((acc, col) => {
      acc[col.id] = "";
      return acc;
    }, {});
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    onChange?.(updatedRows);
  };

  const handleDeleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    onChange?.(updatedRows);
  };

  return (
    <div className="table-container">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns?.length > 0 &&
              columns.map((col) => (
                <th
                  key={col.id}
                  className="border border-gray-300 px-4 py-2 text-left"
                  style={{ width: col.width || "auto" }}
                >
                  {col.header}
                </th>
              ))}
            {canDeleteRows && (
              <th
                style={{ width: "8%" }}
              >
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows?.length > 0 &&
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns?.length > 0 &&
                  columns.map((col) => (
                    <td
                      key={col.id}
                      className="border border-gray-300 px-4 py-2"
                      style={{ width: col.width || "auto" }}
                    >
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-2 py-1"
                        value={row[col.id] || ""}
                        onChange={(e) =>
                          handleCellChange(rowIndex, col.id, e.target.value)
                        }
                      />
                    </td>
                  ))}
                {canDeleteRows && (
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className="material-symbols-outlined text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handleDeleteRow(rowIndex)}
                    >
                      delete
                    </span>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {allowAddRows && (
        <div className="w-full flex justify-end">
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleAddRow}
          >
            {addRowText || "Agregar fila"}
          </button>
        </div>
      )}
    </div>
  );
};
