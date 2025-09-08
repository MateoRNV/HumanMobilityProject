import React, { useMemo, useState } from "react";

/**
 * MatrixQuestion (MatrixInput)
 * Renders a matrix with single or multi-select per row depending on payload.
 *
 * Props (keep names as requested):
 *  - field: {
 *      code: string,
 *      title?: string,
 *      type: 'matrix',
 *      rows: { value: string, label: string, isHeader?: boolean }[],
 *      columns: { value: string, label: string }[],
 *      multiselect?: boolean // if true, allow multiple selections per row
 *    }
 *  - onChange?: (rowValue: string, columnValue: string) => void
 */
export const MatrixInput = ({ field, onChange }) => {
  const headerRow = useMemo(
    () => field.rows.find((r) => r.isHeader),
    [field.rows]
  );
  const bodyRows = useMemo(
    () => field.rows.filter((r) => !r.isHeader),
    [field.rows]
  );

  // answers[row] = string | string[] depending on multiselect
  const [answers, setAnswers] = useState(() => Object.create(null));

  const handleSelect = (rowValue, colValue) => {
    setAnswers((prev) => {
      const isMulti = !!field.multiselect;
      const current = prev[rowValue];
      let nextForRow;

      if (isMulti) {
        const list = Array.isArray(current) ? current : [];
        nextForRow = list.includes(colValue)
          ? list.filter((v) => v !== colValue)
          : [...list, colValue];
      } else {
        nextForRow = colValue; // single choice
      }

      const next = { ...prev, [rowValue]: nextForRow };
      console.log({ row: rowValue, column: colValue });
      if (onChange) onChange(rowValue, colValue);
      return next;
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {field.title && (
        <div className={`flex items-center w-1/2 py-3 `}>
          <div className="me-3">{`${field.order})`}</div>
          <div>{field.title}</div>
        </div>
      )}

      {/* Matrix table */}
      <div className="overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left font-medium px-4 py-3 w-[45%]">
                {headerRow ? headerRow.label : ""}
              </th>
              {field.columns.map((col) => (
                <th
                  key={col.value}
                  className="font-medium px-4 py-3 text-center"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row) => (
              <tr key={row.value} className="odd:bg-white even:bg-gray-50/60">
                <td className="px-4 py-3 align-middle text-gray-800">
                  {row.label}
                </td>
                {field.columns.map((col) => {
                  const isMulti = !!field.multiselect;
                  const valueForRow = answers[row.value];
                  const checked = isMulti
                    ? Array.isArray(valueForRow) &&
                      valueForRow.includes(col.value)
                    : valueForRow === col.value;
                  return (
                    <td key={col.value} className="px-4 py-3 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={`matrix-${field.code}-${row.value}${
                            isMulti ? "-multi" : ""
                          }`}
                          value={col.value}
                          checked={!!checked}
                          onChange={() => handleSelect(row.value, col.value)}
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
