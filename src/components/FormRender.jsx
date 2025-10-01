import React, { useMemo, useState } from "react";
import Select from "react-select";
import styles from "./form-render.module.css";
import { FloatingInput } from "./FloatingInput/FloatingInput";
import { DateInput } from "./DateInput/DateInput";
import { MatrixInput } from "./MatrixInput/MatrixInput";
import { CheckboxInput } from "./CheckboxInput/CheckboxInput";
import { TextareaField } from "./TextArea/TextArea";
import { Table } from "./Table/Table";

/** Helpers */
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

// answers[] -> mapa por fieldId
const buildAnswerIndex = (answers = []) => {
  const idx = new Map();
  for (const a of answers) idx.set(a.fieldId, a);
  return idx;
};

export const FormRender = ({
  formSchema,
  initialAnswers = [],
  onSubmit,
  onCancel,
  onChange, // opcional: te aviso cada cambio
}) => {
  const { title = "", sections = [] } = formSchema || {};
  const [answerIndex, setAnswerIndex] = useState(() =>
    buildAnswerIndex(initialAnswers)
  );

  // util para leer valor “normalizado”
  const getValue = (field) => {
    const a = answerIndex.get(field.id);
    if (!a) return null;

    if (field.type === "select") return a.value ?? null;

    if (field.type === "multi-select")
      return Array.isArray(a.value) ? a.value : [];

    if (field.type === "checkbox") return !!a.value;

    if (field.type === "matrix") {
      return {
        selections: a.selections ?? [],
        observations: a.observations ?? "",
      };
    }

    // text | number | date | textarea | table
    return a.value ?? null;
  };

  // util para setear y notificar
  const setAnswer = (field, partial) => {
    setAnswerIndex((prev) => {
      const curr = prev.get(field.id) || {
        fieldId: field.id,
        type: field.type,
      };
      const next = { ...curr, ...partial, fieldId: field.id, type: field.type };
      const clone = new Map(prev);
      clone.set(field.id, next);
      // notificar afuera si hace falta
      onChange?.(field.id, next);
      return clone;
    });
  };

  // react-select necesita objetos option
  const optionByValue = (opts = [], v) =>
    opts.find((o) => o.value === v) || null;
  const optionsByValues = (opts = [], values = []) =>
    (values || []).map((v) => optionByValue(opts, v)).filter(Boolean);

  /** UI helpers */
  const FieldRow = ({ field, rightClassName = "", children }) => (
    <div className="flex">
      <div className="flex items-center w-1/2 p-3 border-right">
        <div className="me-3">{`${field.order})`}</div>
        <div>{field.title}</div>
      </div>
      <div
        className={`flex justify-center items-center w-1/2 p-3 ${rightClassName}`}
      >
        {children}
      </div>
    </div>
  );

  const renderField = (field) => {
    const v = getValue(field);

    switch (field.type) {
      case "text":
        return (
          <FieldRow field={field}>
            <FloatingInput
              id={`text-${field.id}`}
              type="text"
              label={field.placeholder || "Escribe aquí..."}
              widthClass="w-96"
              inputFocusClass="focus:border-blue-500"
              labelFocusClass="peer-focus:text-blue-500"
              required={field.required}
              value={v ?? ""}
              onChange={(e) => setAnswer(field, { value: e.target.value })}
            />
          </FieldRow>
        );

      case "number":
        return (
          <FieldRow field={field}>
            <FloatingInput
              id={`number-${field.id}`}
              type="number"
              label={field.placeholder || "Número"}
              widthClass="w-40"
              inputFocusClass="focus:border-green-500"
              labelFocusClass="peer-focus:text-green-500"
              required={field.required}
              value={v ?? ""}
              onChange={(e) =>
                setAnswer(field, {
                  value: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </FieldRow>
        );

      case "date":
        return (
          <FieldRow field={field} rightClassName={styles["date-input"]}>
            <DateInput
              id={`date-${field.id}`}
              label={field.placeholder || "Selecciona una fecha"}
              value={v ?? ""}
              onChange={(val) => setAnswer(field, { value: val })}
            />
          </FieldRow>
        );

      case "select":
      case "multi-select":
        return (
          <FieldRow field={field}>
            <Select
              className="w-full"
              options={field.options || []}
              isClearable
              isSearchable
              isMulti={field.type === "multi-select"}
              required={field.required}
              value={
                field.type === "multi-select"
                  ? optionsByValues(field.options, v)
                  : optionByValue(field.options, v)
              }
              onChange={(opt) => {
                if (field.type === "multi-select") {
                  const values = (opt || []).map((o) => o.value);
                  setAnswer(field, { value: values });
                } else {
                  setAnswer(field, { value: opt ? opt.value : null });
                }
              }}
            />
          </FieldRow>
        );

      case "matrix": {
        const ans = answerIndex.get(field.id);

        return (
          <FieldRow field={field} key={field.id}>
            <MatrixInput
              field={field}
              selections={ans?.selections || []}
              onChange={(row, col) => {
                const isMulti = !!field.multiselect;
                const prevSel = answerIndex.get(field.id)?.selections || [];

                let nextSel;
                if (isMulti) {
                  const exists = prevSel.some(
                    (s) => s.row === row && s.column === col
                  );
                  nextSel = exists
                    ? prevSel.filter(
                        (s) => !(s.row === row && s.column === col)
                      )
                    : [...prevSel, { row, column: col }];
                } else {
                  nextSel = [
                    ...prevSel.filter((s) => s.row !== row),
                    { row, column: col },
                  ];
                }

                setAnswer(field, { type: "matrix", selections: nextSel });
              }}
            />
          </FieldRow>
        );
      }

      case "checkbox":
        return (
          <FieldRow field={field} rightClassName={styles["date-input"]}>
            <CheckboxInput
              checked={!!v}
              onChange={(checked) => setAnswer(field, { value: checked })}
            />
          </FieldRow>
        );

      case "textarea":
        return (
          <FieldRow field={field}>
            <TextareaField
              label={field.placeholder || "Escribe aquí..."}
              value={v ?? ""}
              onChange={(e) => setAnswer(field, { value: e.target.value })}
              required={field.required}
            />
          </FieldRow>
        );

      case "table":
        return <Table field={field} />;

      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const answers = Array.from(answerIndex.values());
    onSubmit?.({ answers });
  };

  return (
    <form className={styles["form-container"]} onSubmit={handleSubmit}>
      <h1 className="text-center py-4">{title}</h1>

      {/* Secciones */}
      <div>
        {[...(sections || [])].sort(byOrder).map((section) => (
          <div key={section.id}>
            <h2 className={styles["section-title"]}>
              {`${section.order}) ${section.title}`}
            </h2>

            {[...(section.fields || [])].sort(byOrder).map((field) => (
              <div key={field.id} className={styles["field-container"]}>
                {renderField(field)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end p-4">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        {onSubmit && (
          <button type="submit" className="btn-primary">
            Guardar
          </button>
        )}
      </div>
    </form>
  );
};
