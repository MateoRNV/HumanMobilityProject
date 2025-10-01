import React, { useMemo, useState, useEffect } from "react";

export const MatrixInput = ({ field, value, selections, onChange }) => {
  const headerRow = useMemo(
    () => field.rows.find((r) => r.isHeader),
    [field.rows]
  );
  const bodyRows = useMemo(
    () => field.rows.filter((r) => !r.isHeader),
    [field.rows]
  );

  const [answers, setAnswers] = useState(() => Object.create(null));

  useEffect(() => {
    if (value && typeof value === "object") setAnswers(value);
  }, [value]);

  useEffect(() => {
    if (!value && Array.isArray(selections)) {
      const isMulti = !!field.multiselect;
      const map = Object.create(null);
      for (const sel of selections) {
        const r = sel.row;
        const c = sel.column;
        if (isMulti) {
          if (!Array.isArray(map[r])) map[r] = [];
          if (!map[r].includes(c)) map[r].push(c);
        } else {
          map[r] = c;
        }
      }
      setAnswers(map);
    }
  }, [selections, value, field.multiselect]);

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
        nextForRow = colValue;
      }

      const next = { ...prev, [rowValue]: nextForRow };
      if (onChange) onChange(rowValue, colValue);
      return next;
    });
  };

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
                {headerRow ? headerRow.label : ""}
              </th>
              {field.columns.map((col) => (
                <th key={col.value} className="font-medium px-4 py-3 text-center">
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
                    ? Array.isArray(valueForRow) && valueForRow.includes(col.value)
                    : valueForRow === col.value;

                  return (
                    <td key={col.value} className="px-4 py-3 text-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={`matrix-${nameBase}-${row.value}${isMulti ? "-multi" : ""}`}
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
