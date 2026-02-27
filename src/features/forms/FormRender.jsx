import React, { useState } from "react";
import styles from "./form-render.module.css";
import { TextareaField } from "../../components/ui/TextArea/TextArea";
import { FIELD_RENDERERS } from "./inputs/renderers";
import toast from "react-hot-toast";

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
            defaultValue={answerIndex.get(field.id)?.observationsValue || ""}
            onBlur={(e) =>
              setAnswer(field, { observationsValue: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );

  const renderField = (fieldDefinition) => {
    const normalizedValue = getNormalizedValue(fieldDefinition);
    const Renderer = FIELD_RENDERERS[fieldDefinition.type];

    if (!Renderer) return null;

    return (
      <Renderer
        field={fieldDefinition}
        value={normalizedValue}
        setAnswer={setAnswer}
        answerIndex={answerIndex}
        FieldRow={FieldRow}
      />
    );
  };

  const validateRequiredFields = () => {
    const missingFields = [];
    for (const section of formSchema?.sections || []) {
      for (const field of section.fields || []) {
        if (field.required) {
          const val = getNormalizedValue(field);
          if (
            val === null ||
            val === undefined ||
            val === "" ||
            (Array.isArray(val) && val.length === 0)
          ) {
            missingFields.push(field.title || `Campo ${field.order}`);
          }
        }
      }
    }
    return missingFields;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();

    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      toast.error(
        `Faltan campos obligatorios por completar:\n- ${missingFields.join("\n- ")}`,
        { duration: 5000 },
      );
      return;
    }
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
                      defaultValue={
                        answerIndex.get(section.id)?.observationsValue || ""
                      }
                      onBlur={(e) =>
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
