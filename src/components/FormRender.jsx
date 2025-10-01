import React from "react";
import Select from "react-select";
import styles from "./form-render.module.css";
import { FloatingInput } from "./FloatingInput/FloatingInput";
import { DateInput } from "./DateInput/DateInput";
import { MatrixInput } from "./MatrixInput/MatrixInput";
import { CheckboxInput } from "./CheckboxInput/CheckboxInput";
import { TextareaField } from "./TextArea/TextArea";
import { Table } from "./Table/Table";

/**
 * Componentes pequeños y reutilizables para eliminar duplicación
 */
const FieldRow = ({ field, rightClassName = "", children }) => (
  <div className="flex">
    <div className={`flex items-center w-1/2 p-3 border-right`}>
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

/**
 * Renderizador por tipo con piezas reutilizables
 */
const renderField = (field) => {
  switch (field.type) {
    case "text":
      return (
        <FieldRow field={field}>
          <FloatingInput
            id={`text-${field.code}`}
            type="text"
            label={field.placeholder || "Escribe aqui..."}
            widthClass="w-96"
            inputFocusClass="focus:border-blue-500"
            labelFocusClass="peer-focus:text-blue-500"
            required={field.required}
          />
        </FieldRow>
      );
    case "number":
      return (
        <FieldRow field={field}>
          <FloatingInput
            id={`number-${field.code}`}
            type="number"
            label={field.placeholder || "Numero"}
            widthClass="w-40"
            inputFocusClass="focus:border-green-500"
            labelFocusClass="peer-focus:text-green-500"
            required={field.required}
          />
        </FieldRow>
      );
    case "date":
      return (
        <FieldRow field={field} rightClassName={styles["date-input"]}>
          <DateInput id={`date-${field.code}`} label={field.placeholder} />
        </FieldRow>
      );
    case "select":
    case "multi-select":
      return (
        <FieldRow field={field}>
          <Select
            className="w-full"
            options={field.options}
            isClearable
            isSearchable
            isMulti={field.type === "multi-select"}
            required={field.required}
          />
        </FieldRow>
      );
    case "matrix":
      return <MatrixInput field={field} />;
    case "checkbox":
      return (
        <FieldRow field={field} rightClassName={styles["date-input"]}>
          <CheckboxInput checked={field.value} onChange={() => {}} />
        </FieldRow>
      );
    case "textarea":
      return (
        <FieldRow field={field}>
          <TextareaField
            label={field.placeholder || "Escribe aqui..."}
            value={field.value}
            onChange={field.onChange}
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

export const FormRender = (props) => {
  const { formSchema } = props;
  const { title, sections } = formSchema || { title: "", sections: [] };

  return (
    <div className={styles["form-container"]}>
      <h1 className="text-center py-4">{title}</h1>
      {/* Secciones */}
      <div>
        {[...(sections || [])]
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.code}>
              {/* Título de sección */}
              <h2
                className={styles["section-title"]}
              >{`${section.order}) ${section.title}`}</h2>

              {[...(section.fields || [])]
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div key={field.code} className={styles["field-container"]}>
                    {renderField(field)}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};
