import React, { useState } from "react";
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

  // Obtiene el valor normalizado para un field
  const getNormalizedValue = (fieldDefinition) => {
    const answerRecord = answerIndex.get(fieldDefinition.id);
    if (!answerRecord) {
      // Si no hay respuesta, buscar en initialAnswers
      if (fieldDefinition.type === "matrix") {
        // Buscar en initialAnswers por fieldId
        const initialAnswer = initialAnswers.find(
          (answer) => answer.fieldId === fieldDefinition.id
        );
        if (
          initialAnswer &&
          initialAnswer.value &&
          typeof initialAnswer.value === "object"
        ) {
          return initialAnswer.value;
        }
        // Si tiene selections, convertir a value
        if (initialAnswer && Array.isArray(initialAnswer.selections)) {
          const selectionMap = {};
          for (const selection of initialAnswer.selections) {
            const rowValue = selection.row;
            const columnValue = selection.column;
            if (!Array.isArray(selectionMap[rowValue]))
              selectionMap[rowValue] = [];
            if (!selectionMap[rowValue].includes(columnValue))
              selectionMap[rowValue].push(columnValue);
          }
          return selectionMap;
        }
        return {};
      }
      return null;
    }

    if (fieldDefinition.type === "select") return answerRecord.value ?? null;

    if (fieldDefinition.type === "multi-select")
      return Array.isArray(answerRecord.value) ? answerRecord.value : [];

    if (fieldDefinition.type === "checkbox") return !!answerRecord.value;

    if (fieldDefinition.type === "matrix") {
      // Para MatrixInput controlado, value es un objeto { [row]: [col, col, ...] }
      if (answerRecord.value && typeof answerRecord.value === "object")
        return answerRecord.value;
      // Si la respuesta viene con selections, convertirlas a value
      if (Array.isArray(answerRecord.selections)) {
        const selectionMap = {};
        for (const selection of answerRecord.selections) {
          const rowValue = selection.row;
          const columnValue = selection.column;
          if (!Array.isArray(selectionMap[rowValue]))
            selectionMap[rowValue] = [];
          if (!selectionMap[rowValue].includes(columnValue))
            selectionMap[rowValue].push(columnValue);
        }
        return selectionMap;
      }
      return {};
    }

    // text | number | date | textarea | table
    return answerRecord.value ?? null;
  };

  // util para setear y notificar
  const setAnswer = (fieldDefinition, partialUpdate) => {
    setAnswerIndex((prev) => {
      const currentEntry = prev.get(fieldDefinition.id) || {
        fieldId: fieldDefinition.id,
        type: fieldDefinition.type,
      };
      const nextEntry = {
        ...currentEntry,
        ...partialUpdate,
        fieldId: fieldDefinition.id,
        type: fieldDefinition.type,
      };
      const nextMap = new Map(prev);
      nextMap.set(fieldDefinition.id, nextEntry);
      onChange?.(fieldDefinition.id, nextEntry);
      return nextMap;
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

  const renderField = (fieldDefinition) => {
    const normalizedValue = getNormalizedValue(fieldDefinition);

    switch (fieldDefinition.type) {
      case "text":
        return (
          <FieldRow field={fieldDefinition}>
            <FloatingInput
              id={`text-${fieldDefinition.id}`}
              type="text"
              label={fieldDefinition.placeholder || "Escribe aquí..."}
              widthClass="w-96"
              inputFocusClass="focus:border-blue-500"
              labelFocusClass="peer-focus:text-blue-500"
              required={fieldDefinition.required}
              defaultValue={normalizedValue ?? ""}
              onBlur={(e) =>
                setAnswer(fieldDefinition, { value: e.target.value })
              }
            />
          </FieldRow>
        );
      case "number":
        return (
          <FieldRow field={fieldDefinition}>
            <FloatingInput
              id={`number-${fieldDefinition.id}`}
              type="number"
              label={fieldDefinition.placeholder || "Número"}
              widthClass="w-40"
              inputFocusClass="focus:border-blue-500"
              labelFocusClass="peer-focus:text-blue-500"
              required={fieldDefinition.required}
              defaultValue={normalizedValue ?? ""}
              onBlur={(e) =>
                setAnswer(fieldDefinition, {
                  value: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </FieldRow>
        );

      case "date":
        return (
          <FieldRow
            field={fieldDefinition}
            rightClassName={styles["date-input"]}
          >
            <DateInput
              id={`date-${fieldDefinition.id}`}
              label={fieldDefinition.placeholder || "Selecciona una fecha"}
              value={normalizedValue ?? ""}
              onChange={(val) => setAnswer(fieldDefinition, { value: val })}
            />
          </FieldRow>
        );

      case "select":
      case "multi-select":
        return (
          <FieldRow field={fieldDefinition}>
            <Select
              className="w-full"
              options={fieldDefinition.options || []}
              isClearable
              isSearchable
              isMulti={fieldDefinition.type === "multi-select"}
              required={fieldDefinition.required}
              value={
                fieldDefinition.type === "multi-select"
                  ? optionsByValues(fieldDefinition.options, normalizedValue)
                  : optionByValue(fieldDefinition.options, normalizedValue)
              }
              onChange={(opt) => {
                if (fieldDefinition.type === "multi-select") {
                  const values = (opt || []).map((o) => o.value);
                  setAnswer(fieldDefinition, { value: values });
                } else {
                  setAnswer(fieldDefinition, { value: opt ? opt.value : null });
                }
              }}
            />
          </FieldRow>
        );

      case "matrix": {
        // value es el objeto controlado
        return (
          <FieldRow field={fieldDefinition} key={fieldDefinition.id}>
            <MatrixInput
              field={fieldDefinition}
              value={getNormalizedValue(fieldDefinition)}
              onChange={(nextValue) =>
                setAnswer(fieldDefinition, { value: nextValue })
              }
            />
          </FieldRow>
        );
      }

      case "checkbox":
        return (
          <FieldRow
            field={fieldDefinition}
            rightClassName={styles["date-input"]}
          >
            <CheckboxInput
              checked={!!normalizedValue}
              onChange={(checked) =>
                setAnswer(fieldDefinition, { value: checked })
              }
            />
          </FieldRow>
        );

      case "textarea":
        return (
          <FieldRow field={fieldDefinition}>
            <TextareaField
              label={fieldDefinition.placeholder || "Escribe aquí..."}
              defaultValue={normalizedValue ?? ""}
              onBlur={(e) =>
                setAnswer(fieldDefinition, { value: e.target.value })
              }
              required={fieldDefinition.required}
            />
          </FieldRow>
        );

      case "table":
        return <Table field={fieldDefinition} />;

      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    // Convertir matrices a formato selections
    const submittedAnswers = Array.from(answerIndex.values()).map(
      (answerEntry) => {
        if (
          answerEntry.type === "matrix" &&
          answerEntry.value &&
          typeof answerEntry.value === "object"
        ) {
          // value: { [row]: [col, col, ...] } => selections: [{row, column}]
          const selectionsArray = [];
          for (const rowKey in answerEntry.value) {
            for (const columnKey of answerEntry.value[rowKey]) {
              selectionsArray.push({ row: rowKey, column: columnKey });
            }
          }
          return { ...answerEntry, selections: selectionsArray };
        }
        return answerEntry;
      }
    );
    onSubmit?.({ answers: submittedAnswers });
  };

  return (
    <form className={styles["form-container"]} onSubmit={handleSubmit}>
      <h1 className="text-center py-4">{title}</h1>

      {/* Secciones */}
      <div>
        {[...(sections || [])].sort(byOrder).map((section) => (
          <div key={section.id}>
            <h2
              className={styles["section-title"]}
            >{`${section.order}) ${section.title}`}</h2>
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
