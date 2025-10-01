import React, { useMemo, useState } from "react";

/**
 * Tabla dinámica SIN librerías externas
 * ------------------------------------
 * - Sin Tailwind, sin iconos, solo React + CSS inline.
 * - Permite agregar y eliminar filas.
 * - Columnas configurables por JSON (key + header + type opcional).
 *
 * MOCK JSON (con los datos del ejemplo de la imagen)
 * --------------------------------------------------
 * const field = {
 *   code: "familyTable",
 *   title: "Integrantes del núcleo familiar",
 *   type: "table",
 *   columns: [
 *     { key: "name", header: "Nombres y Apellidos", type: "text" },
 *     { key: "age", header: "Edad", type: "text" },
 *     { key: "relationship", header: "Parentesco", type: "text" },
 *     { key: "marital_status", header: "Estado Civil", type: "text" },
 *     { key: "education_level", header: "Grado de Intrucción", type: "text" },
 *     { key: "occupation", header: "Ocupación", type: "text" },
 *     { key: "disability", header: "Discapacidad", type: "text" },
 *   ],
 *   allowAddRows: true,
 *   canDeleteRows: true,
 *   addRowText: "Agregar fila"
 * };
 *
 * const initialValue = [
 *   {
 *     name: "JAVIER EUCLIDES SANTIESTEBNA TORRES",
 *     age: "52",
 *     relationship: "PAREJA",
 *     marital_status: "CASADO",
 *     education_level: "BACHILLER",
 *     occupation: "N/A ESPORADICOS",
 *     disability: "",
 *   },
 *   {
 *     name: "ROSA BEATRIZ SALAS RENGIFO",
 *     age: "50",
 *     relationship: "PAREJA",
 *     marital_status: "CASADA",
 *     education_level: "BACHILLER",
 *     occupation: "AMA DE CASA",
 *     disability: "",
 *   },
 *   {
 *     name: "INDIRA ESTEFANY SANTI ESTEBAN SALAS",
 *     age: "26",
 *     relationship: "HIJA",
 *     marital_status: "SOLTERA",
 *     education_level: "BACHILLER",
 *     occupation: "AMBULANTE",
 *     disability: "",
 *   },
 *   {
 *     name: "JHANSSEN STID ORDOÑEZ PEREA",
 *     age: "7",
 *     relationship: "CRIANZA",
 *     marital_status: "*",
 *     education_level: "2DO DE PRIMARIA",
 *     occupation: "",
 *     disability: "UN MES Y MEDIO DE NO ESTUDIAR.",
 *   },
 *   {
 *     name: "ANCIL ANDRES SANTIESTEBAN SALAS",
 *     age: "9 MESES",
 *     relationship: "NIETO",
 *     marital_status: "*",
 *     education_level: "*",
 *     occupation: "",
 *     disability: "",
 *   },
 * ];
 *
 * // Uso:
 * // <TableDynamicInput field={field} value={rows} onChange={setRows} />
 */

function makeEmptyRow(columns) {
  const row = {};
  for (const c of columns) row[c.key] = "";
  return row;
}

function CellInput({ column, value, onChange }) {
  const baseStyle = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #D1D5DB",
    borderRadius: 10,
    outline: "none",
    background: "#FFFFFF",
  };
  const handle = (e) => onChange(e.target.value);

  if (column.type === "number") {
    return (
      <input type="number" value={value ?? ""} onChange={handle} style={baseStyle} />
    );
  }
  if (column.type === "select") {
    return (
      <select value={value ?? ""} onChange={handle} style={baseStyle} aria-label={column.header}>
        <option value="" disabled>
          {column.placeholder || "Seleccione..."}
        </option>
        {(column.options || []).map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  return <input type="text" value={value ?? ""} onChange={handle} style={baseStyle} />;
}

export const Table = ({ field, value = [], onChange }) => {
  const columns = field?.columns || [];

  const addRow = () => onChange?.([...(value || []), makeEmptyRow(columns)]);
  const removeRow = (idx) => onChange?.((value || []).filter((_, i) => i !== idx));
  const handleCellChange = (rowIndex, key, cellValue) => {
    const next = [...value];
    next[rowIndex] = { ...(next[rowIndex] || {}), [key]: cellValue };
    onChange?.(next);
  };

  // estilos simples sin librerías
  const styles = {
    wrapper: { width: "100%" },
    title: { marginBottom: 8, fontSize: 18, fontWeight: 600, color: "#111827" },
    desc: { marginTop: 4, fontSize: 13, color: "#6B7280" },
    card: {
      border: "1px solid #E5E7EB",
      borderRadius: 14,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
    table: { width: "100%", fontSize: 14, borderCollapse: "separate", borderSpacing: 0 },
    th: {
      textAlign: "left",
      fontWeight: 600,
      color: "#374151",
      padding: "10px 12px",
      background: "#F9FAFB",
      borderBottom: "1px solid #F3F4F6",
      whiteSpace: "nowrap",
    },
    td: { padding: "10px 12px", borderTop: "1px solid #F3F4F6", verticalAlign: "top" },
    actionsTh: { width: 70 },
    footer: { padding: 10, background: "#F9FAFB", borderTop: "1px solid #F3F4F6" },
    buttonPrimary: {
      display: "inline-flex",
      gap: 8,
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: 12,
      background: "#111827",
      color: "#fff",
      border: "1px solid #111827",
      cursor: "pointer",
    },
    buttonGhost: {
      display: "inline-flex",
      gap: 6,
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 10,
      background: "#fff",
      color: "#374151",
      border: "1px solid #D1D5DB",
      cursor: "pointer",
    },
    empty: { padding: "20px 12px", color: "#6B7280", textAlign: "center" },
  };

  return (
    <div style={styles.wrapper}>
      {field?.title && (
        <div style={{ marginBottom: 12 }}>
          <div style={styles.title}>{field.title}</div>
          {field?.description && <div style={styles.desc}>{field.description}</div>}
        </div>
      )}

      <div style={styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} style={styles.th}>
                    {c.header}
                  </th>
                ))}
                {(field?.canDeleteRows || true) && <th style={{ ...styles.th, ...styles.actionsTh }} />}
              </tr>
            </thead>
            <tbody>
              {(value || []).length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} style={styles.empty}>
                    Sin filas aún. Usa “{field?.addRowText || "Agregar fila"}”.
                  </td>
                </tr>
              )}

              {(value || []).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((c) => (
                    <td key={c.key} style={styles.td}>
                      <CellInput
                        column={c}
                        value={row?.[c.key]}
                        onChange={(v) => handleCellChange(rowIndex, c.key, v)}
                      />
                    </td>
                  ))}
                  {(field?.canDeleteRows || true) && (
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => removeRow(rowIndex)}
                        aria-label={`Eliminar fila ${rowIndex + 1}`}
                        title="Eliminar"
                        style={styles.buttonGhost}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {field?.allowAddRows !== false && (
          <div style={styles.footer}>
            <button type="button" onClick={addRow} style={styles.buttonPrimary}>
              ＋ {field?.addRowText || "Agregar fila"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
