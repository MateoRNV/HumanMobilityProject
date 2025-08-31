import React from "react";
import triageSchema from "../schema/triage.json";
import Select from "react-select";
import styles from "./form-render.module.css";

export const FormRender = () => {
  console.log(triageSchema);

  const getFieldComponent = (field) => {
    switch (field.type) {
      case "text":
        return (
          <div className="flex justify-start">
            <div className={`flex items-center w-1/2 p-3 border-right`}>
              <div className="me-3">{`${field.order})`}</div>
              <div>{field.title}</div>
            </div>
            <div className="flex justify-center w-1/2 p-3">
              <div className="relative w-96">
                <input
                  type="text"
                  id="floating-text"
                  className="peer w-full px-4 pt-6 pb-2 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 placeholder-transparent"
                  placeholder="Tu nombre"
                />
                <label
                  htmlFor="floating-text"
                  className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-blue-500"
                >
                  {field.placeholder || "Escribe aqui..."}
                </label>
              </div>
            </div>
          </div>
        );
      case "number":
        return (
          <div className="flex justify-start">
            <div className={`flex items-center w-1/2 p-3 border-right`}>
              <div className="me-3">{`${field.order})`}</div>
              <div>{field.title}</div>
            </div>
            <div className="flex justify-center w-1/2 p-3">
              <div className="relative w-40">
                <input
                  type="number"
                  id="floating-number"
                  className="peer w-full px-4 pt-6 pb-2 text-slate-900 bg-white border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors duration-200 placeholder-transparent"
                  placeholder="Tu edad"
                />
                <label
                  htmlFor="floating-number"
                  className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-green-500"
                >
                  {field.placeholder || "Numero"}
                </label>
              </div>
            </div>
          </div>
        );
      case "date":
        return (
          <div className="flex justify-start">
            <div className={`flex items-center w-1/2 p-3 border-right`}>
              <div className="me-3">{`${field.order})`}</div>
              <div>{field.title}</div>
            </div>
            <div
              className={`flex justify-center w-1/2 p-3 ${styles["date-input"]}`}
            >
              <input
                id={`date-${field.code}`}
                type="date"
                required={field.required}
              />
            </div>
          </div>
        );
      case "select":
        return (
          <div className="flex">
            <div className="flex items-center p-3 w-1/2 border-right">
              <div className="me-3">{`${field.order})`}</div>
              <div>{field.title}</div>
            </div>
            <div className="flex justify-center items-center w-1/2 p-3">
              <Select
                className="w-full"
                options={field.options}
                isClearable
                isSearchable
                required={field.required}
              />
            </div>
          </div>
        );
      case "multi-select":
        return (
          <div className="flex">
            <div className="flex items-center p-3 w-1/2 border-right">
              <div className="me-3">{`${field.order})`}</div>
              <div>{field.title}</div>
            </div>
            <div className="flex justify-center items-center w-1/2 p-3">
              <Select
                className="w-full"
                options={field.options}
                isClearable
                isSearchable
                isMulti
                required={field.required}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles["form-container"]}>
      <h1 className="text-center">{triageSchema.title}</h1>
      {/* Section Rendering */}
      <div>
        {triageSchema.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div key={section.code}>
              {/* Section title */}
              <h2
                className={styles["section-title"]}
              >{`${section.order}) ${section.title}`}</h2>
              {section.fields.map((field) => (
                <div key={field.code}>
                  {/* Field Rendering */}
                  <div className={styles["field-container"]}>
                    {getFieldComponent(field)}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
