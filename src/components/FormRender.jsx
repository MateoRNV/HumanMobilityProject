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

// answers[] -> mapa por campoId
const buildAnswerIndex = (answers = []) => {
  const idx = new Map();
  for (const a of answers) {
    idx.set(a.campoId, {
      ...a,
      observationsValue: a.observationsValue || a.observations || "",
    });
  }
  return idx;
};

export const FormRender = ({
  formSchema,
  initialAnswers = [],
  onSubmit,
  onCancel,
  onChange,
  lastUpdate,
}) => {
  const { title = "", sections = [] } = formSchema || {};
  const [answerIndex, setAnswerIndex] = useState(() =>
    buildAnswerIndex(initialAnswers),
  );
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (sectionId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getNormalizedValue = (fieldDefinition) => {
    const answerRecord = answerIndex.get(fieldDefinition.id);
    if (!answerRecord) {
      if (fieldDefinition.type === "matrix") {
        const initialAnswer = initialAnswers.find(
          (answer) => answer.campoId === fieldDefinition.id,
        );
        if (
          initialAnswer &&
          initialAnswer.value &&
          typeof initialAnswer.value === "object"
        ) {
          return initialAnswer.value;
        }
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
      if (answerRecord.value && typeof answerRecord.value === "object")
        return answerRecord.value;
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

    return answerRecord.value ?? null;
  };

  const setAnswer = (fieldDefinition, partialUpdate) => {
    setAnswerIndex((prev) => {
      const currentEntry = prev.get(fieldDefinition.id) || {
        campoId: fieldDefinition.id,
        type: fieldDefinition.type,
      };
      const nextEntry = {
        ...currentEntry,
        ...partialUpdate,
        campoId: fieldDefinition.id,
        type: fieldDefinition.type,
      };
      const nextMap = new Map(prev);
      nextMap.set(fieldDefinition.id, nextEntry);
      onChange?.(fieldDefinition.id, nextEntry);
      return nextMap;
    });
  };

  const optionByValue = (opts = [], v) =>
    opts.find((o) => o.value === v) || null;
  const optionsByValues = (opts = [], values = []) =>
    (values || []).map((v) => optionByValue(opts, v)).filter(Boolean);

  const FieldRow = ({ field, rightClassName = "", children }) => (
    <div className={styles["field-container"]}>
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
        <div className={`w-full md:w-2/5 ${styles["field-label-col"]}`}>
          <span className={styles["field-number"]}>{field.order}.</span>
          <span>{field.title}</span>
        </div>
        <div
          className={`w-full md:w-3/5 flex flex-col justify-center ${rightClassName}`}
        >
          {children}
        </div>
      </div>
      {field.observations && (
        <div className="w-full mt-6 pl-0 md:pl-[calc(40%+2rem)]">
          <TextareaField
            id={`observations-${field.id}`}
            label={field.observationsLabel || "Observaciones"}
            value={answerIndex.get(field.id)?.observationsValue || ""}
            onChange={(e) =>
              setAnswer(field, { observationsValue: e.target.value })
            }
          />
        </div>
      )}
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
              label={fieldDefinition.placeholder || "Respuesta"}
              widthClass="w-full"
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
              widthClass="w-full max-w-xs"
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
        return (
          <div className={styles["field-container"]} key={fieldDefinition.id}>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center w-full">
                <span className={styles["field-number"]}>
                  {fieldDefinition.order}.
                </span>
                <span className="font-medium text-gray-700 text-lg">
                  {fieldDefinition.title}
                </span>
              </div>
              <div className="w-full">
                <MatrixInput
                  field={fieldDefinition}
                  value={getNormalizedValue(fieldDefinition)}
                  onChange={(nextValue) =>
                    setAnswer(fieldDefinition, { value: nextValue })
                  }
                />
              </div>
            </div>
            {fieldDefinition.observations && (
              <div className="w-full mt-6">
                <TextareaField
                  id={`observations-${fieldDefinition.id}`}
                  label={fieldDefinition.observationsLabel || "Observaciones"}
                  value={
                    answerIndex.get(fieldDefinition.id)?.observationsValue || ""
                  }
                  onChange={(e) =>
                    setAnswer(fieldDefinition, {
                      observationsValue: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
        );
      }

      case "checkbox":
        return (
          <FieldRow
            field={fieldDefinition}
            rightClassName={styles["checkbox-input"]}
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
              label={fieldDefinition.placeholder || "Comentarios / Respuesta"}
              defaultValue={normalizedValue ?? ""}
              onBlur={(e) =>
                setAnswer(fieldDefinition, { value: e.target.value })
              }
              required={fieldDefinition.required}
            />
          </FieldRow>
        );

      case "table":
        return (
          <div className={`${styles["table-container"]}`}>
            {fieldDefinition?.title && (
              <div className={styles["table-title"]}>
                {`${fieldDefinition.order}) ${fieldDefinition.title}`}
              </div>
            )}
            <Table
              columns={fieldDefinition.columns}
              data={normalizedValue || []}
              onChange={(updatedRows) =>
                setAnswer(fieldDefinition, { value: updatedRows })
              }
              allowAddRows={fieldDefinition.allowAddRows}
              canDeleteRows={fieldDefinition.canDeleteRows}
              addRowText={fieldDefinition.addRowText}
            />
          </div>
        );
      case "long-text":
        return (
          <div className={styles["field-container"]}>
            {fieldDefinition.title && (
              <h3 className="mt-4 mb-2 ms-3">{`${fieldDefinition.order}) ${fieldDefinition.title}`}</h3>
            )}
            <TextareaField
              label={fieldDefinition.placeholder || "Comentarios / Respuesta"}
              defaultValue={normalizedValue ?? ""}
              onBlur={(e) =>
                setAnswer(fieldDefinition, { value: e.target.value })
              }
              required={fieldDefinition.required}
            />
          </div>
        );
      case "multi-checkbox":
        return (
          <div>
            {fieldDefinition.title && (
              <h3 className={styles["checkbox-title"]}>
                <span className={styles["field-number"]}>
                  {String(fieldDefinition.order).padStart(2, "0")}
                </span>
                {fieldDefinition.title}
              </h3>
            )}
            <div className="flex flex-col">
              {(fieldDefinition.options || []).map((opt) => (
                <div className={styles["checkbox-container"]} key={opt.value}>
                  <div>{opt.label}</div>
                  <CheckboxInput
                    key={opt.value}
                    checked={
                      Array.isArray(normalizedValue)
                        ? normalizedValue.includes(opt.value)
                        : false
                    }
                    onChange={(checked) => {
                      let updatedValues = Array.isArray(normalizedValue)
                        ? [...normalizedValue]
                        : [];
                      if (checked) {
                        if (!updatedValues.includes(opt.value)) {
                          updatedValues.push(opt.value);
                        }
                      } else {
                        updatedValues = updatedValues.filter(
                          (v) => v !== opt.value,
                        );
                      }
                      setAnswer(fieldDefinition, { value: updatedValues });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const submittedAnswers = Array.from(answerIndex.values()).map(
      (answerEntry) => {
        if (
          answerEntry.type === "matrix" &&
          answerEntry.value &&
          typeof answerEntry.value === "object"
        ) {
          const selectionsArray = [];
          for (const rowKey in answerEntry.value) {
            for (const columnKey of answerEntry.value[rowKey]) {
              selectionsArray.push({ row: rowKey, column: columnKey });
            }
          }
          return { ...answerEntry, selections: selectionsArray };
        }
        return answerEntry;
      },
    );
    onSubmit?.({ answers: submittedAnswers });
  };

  return (
    <form className={styles["form-container"]} onSubmit={handleSubmit}>
      <div className="bg-[#273a71] text-white py-8 px-8 flex flex-col justify-center rounded-t-lg">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {title}
        </h1>
        {lastUpdate && (
          <div className="text-sm text-blue-100 font-medium">
            Última actualización:{" "}
            {new Date(lastUpdate).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Secciones */}
      <div className="flex flex-col pb-4">
        {[...(sections || [])].sort(byOrder).map((section) => {
          const isCollapsed = collapsedSections[section.id];
          return (
            <div key={section.id} className="border-b border-gray-200">
              <h2
                className={`${styles["section-title"]} flex justify-between items-center cursor-pointer select-none`}
                onClick={() => toggleSection(section.id)}
              >
                <div>
                  <span className="text-[var(--primary-color)] mr-3">
                    {section.order}.
                  </span>
                  {section.title}
                </div>
                <span
                  className="material-symbols-outlined text-[var(--primary-color)] transition-transform duration-200"
                  style={{
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0)",
                  }}
                >
                  expand_more
                </span>
              </h2>
              <div
                className={`transition-all duration-300 overflow-hidden ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[10000px] opacity-100"}`}
              >
                {[...(section.fields || [])].sort(byOrder).map((field) => (
                  <div key={field.id}>{renderField(field)}</div>
                ))}
                {section.observations && (
                  <div className="w-full mt-8 px-8 pb-8">
                    <TextareaField
                      id={`observations-${section.id}`}
                      label={
                        section.observationsLabel ||
                        "Observaciones Generales de la Sección"
                      }
                      value={
                        answerIndex.get(section.id)?.observationsValue || ""
                      }
                      onChange={(e) =>
                        setAnswer(section, {
                          observationsValue: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 justify-end p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        {onCancel && (
          <button
            type="button"
            className={styles["cancel-btn"]}
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        {onSubmit && (
          <button type="submit" className={styles["submit-btn"]}>
            Guardar Respuestas
          </button>
        )}
      </div>
    </form>
  );
};
