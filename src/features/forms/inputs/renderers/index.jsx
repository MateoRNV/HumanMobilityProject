import React from "react";
import { FloatingInput } from "../../../../components/ui/FloatingInput/FloatingInput";
import { DateInput } from "../../../../components/ui/DateInput/DateInput";
import { SelectInput } from "../../../../components/ui/SelectInput/SelectInput";
import { MatrixInput } from "../MatrixInput/MatrixInput";
import { CheckboxInput } from "../../../../components/ui/CheckboxInput/CheckboxInput";
import { TextareaField } from "../../../../components/ui/TextArea/TextArea";
import { Table } from "../Table/Table";
import styles from "../../form-render.module.css";

const optionByValue = (opts = [], v) => opts.find((o) => o.value === v) || null;
const optionsByValues = (opts = [], values = []) =>
  (values || []).map((v) => optionByValue(opts, v)).filter(Boolean);

export const TextRenderer = ({ field, value, setAnswer, FieldRow }) => (
  <FieldRow field={field}>
    <FloatingInput
      id={`text-${field.id}`}
      type="text"
      label={field.placeholder || "Respuesta"}
      widthClass="w-full"
      required={field.required}
      defaultValue={value ?? ""}
      onBlur={(e) => setAnswer(field, { value: e.target.value })}
    />
  </FieldRow>
);

export const NumberRenderer = ({ field, value, setAnswer, FieldRow }) => (
  <FieldRow field={field}>
    <FloatingInput
      id={`number-${field.id}`}
      type="number"
      label={field.placeholder || "Número"}
      widthClass="w-full max-w-xs"
      required={field.required}
      defaultValue={value ?? ""}
      onBlur={(e) =>
        setAnswer(field, {
          value: e.target.value === "" ? null : Number(e.target.value),
        })
      }
    />
  </FieldRow>
);

export const DateRenderer = ({ field, value, setAnswer, FieldRow }) => (
  <FieldRow field={field} rightClassName={styles["date-input"]}>
    <DateInput
      id={`date-${field.id}`}
      label={field.placeholder || "Selecciona una fecha"}
      value={value ?? ""}
      onChange={(val) => setAnswer(field, { value: val })}
    />
  </FieldRow>
);

export const SelectRenderer = ({
  field,
  value,
  setAnswer,
  FieldRow,
  isDisabled,
  answerIndex,
}) => {
  const options = [...(field.options || [])];
  if (field.allowOtherOption) {
    if (!options.find((o) => o.value === "other")) {
      options.push({ label: "Otros", value: "other" });
    }
  }

  const isOther = value === "other";
  const otherTextValue = answerIndex?.get(field.id)?.otherText || "";

  return (
    <FieldRow field={field}>
      <SelectInput
        options={options}
        isMulti={false}
        required={field.required}
        value={optionByValue(options, value)}
        onChange={(opt) => {
          const isSelectedOther = opt && opt.value === "other";
          setAnswer(field, {
            value: opt ? opt.value : null,
            ...(!isSelectedOther ? { otherText: "" } : {}),
          });
        }}
        isDisabled={isDisabled}
      />
      {isOther && (
        <div className="mt-3 w-full">
          <FloatingInput
            id={`other-${field.id}`}
            type="text"
            label="Especificar Otros"
            widthClass="w-full"
            required={field.required}
            defaultValue={otherTextValue}
            onBlur={(e) => setAnswer(field, { otherText: e.target.value })}
            disabled={isDisabled}
          />
        </div>
      )}
    </FieldRow>
  );
};

export const MultiSelectRenderer = ({
  field,
  value,
  setAnswer,
  FieldRow,
  isDisabled,
  answerIndex,
}) => {
  const options = [...(field.options || [])];
  if (field.allowOtherOption) {
    if (!options.find((o) => o.value === "other")) {
      options.push({ label: "Otros", value: "other" });
    }
  }

  const hasOther = (value || []).includes("other");
  const otherTextValue = answerIndex?.get(field.id)?.otherText || "";

  return (
    <FieldRow field={field}>
      <SelectInput
        options={options}
        isMulti={true}
        required={field.required}
        value={optionsByValues(options, value)}
        onChange={(opt) => {
          const values = (opt || []).map((o) => o.value);
          setAnswer(field, {
            value: values,
            ...(!values.includes("other") ? { otherText: "" } : {}),
          });
        }}
        isDisabled={isDisabled}
      />
      {hasOther && (
        <div className="mt-3 w-full">
          <FloatingInput
            id={`other-${field.id}`}
            type="text"
            label="Especificar Otros"
            widthClass="w-full"
            required={field.required}
            defaultValue={otherTextValue}
            onBlur={(e) => setAnswer(field, { otherText: e.target.value })}
            disabled={isDisabled}
          />
        </div>
      )}
    </FieldRow>
  );
};

export const MatrixRenderer = ({ field, value, setAnswer, answerIndex }) => (
  <div className={styles["field-container"]} key={field.id}>
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center w-full">
        <span className={styles["field-number"]}>{field.order}.</span>
        <span className="font-medium text-gray-700 text-lg">{field.title}</span>
      </div>
      <div className="w-full">
        <MatrixInput
          field={field}
          value={value}
          onChange={(nextValue) => setAnswer(field, { value: nextValue })}
        />
      </div>
    </div>
    {field.observations && (
      <div className="w-full mt-6">
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

export const CheckboxRenderer = ({ field, value, setAnswer, FieldRow }) => (
  <FieldRow field={field} rightClassName={styles["checkbox-input"]}>
    <CheckboxInput
      checked={!!value}
      onChange={(checked) => setAnswer(field, { value: checked })}
    />
  </FieldRow>
);

export const TextareaRenderer = ({ field, value, setAnswer, FieldRow }) => (
  <FieldRow field={field}>
    <TextareaField
      label={field.placeholder || "Comentarios / Respuesta"}
      defaultValue={value ?? ""}
      onBlur={(e) => setAnswer(field, { value: e.target.value })}
      required={field.required}
    />
  </FieldRow>
);

export const TableRenderer = ({ field, value, setAnswer, isDisabled }) => (
  <div className={`${styles["table-container"]}`}>
    {field?.title && (
      <div className={styles["table-title"]}>
        {`${field.order}) ${field.title}`}
      </div>
    )}
    <Table
      columns={field.columns}
      data={value || []}
      onChange={(updatedRows) => setAnswer(field, { value: updatedRows })}
      allowAddRows={field.allowAddRows}
      canDeleteRows={field.canDeleteRows}
      addRowText={field.addRowText}
      isDisabled={isDisabled}
    />
  </div>
);

export const LongTextRenderer = ({ field, value, setAnswer }) => (
  <div className={styles["field-container"]}>
    {field.title && (
      <h3 className="mt-4 mb-2 ms-3">{`${field.order}) ${field.title}`}</h3>
    )}
    <TextareaField
      label={field.placeholder || "Comentarios / Respuesta"}
      defaultValue={value ?? ""}
      onBlur={(e) => setAnswer(field, { value: e.target.value })}
      required={field.required}
    />
  </div>
);

export const MultiCheckboxRenderer = ({
  field,
  value,
  setAnswer,
  answerIndex,
  isDisabled,
}) => {
  const options = [...(field.options || [])];
  if (field.allowOtherOption) {
    if (!options.find((o) => o.value === "other")) {
      options.push({ label: "Otros", value: "other" });
    }
  }

  const hasOther = (value || []).includes("other");
  const otherTextValue = answerIndex?.get(field.id)?.otherText || "";

  return (
    <div>
      {field.title && (
        <h3 className={styles["checkbox-title"]}>
          <span className={styles["field-number"]}>
            {String(field.order).padStart(2, "0")}
          </span>
          {field.title}
        </h3>
      )}
      <div className="flex flex-col">
        {options.map((opt) => (
          <div className={styles["checkbox-container"]} key={opt.value}>
            <div>{opt.label}</div>
            <CheckboxInput
              key={opt.value}
              checked={Array.isArray(value) ? value.includes(opt.value) : false}
              onChange={(checked) => {
                let updatedValues = Array.isArray(value) ? [...value] : [];
                if (checked) {
                  if (!updatedValues.includes(opt.value)) {
                    updatedValues.push(opt.value);
                  }
                } else {
                  updatedValues = updatedValues.filter((v) => v !== opt.value);
                }
                setAnswer(field, {
                  value: updatedValues,
                  ...(!updatedValues.includes("other")
                    ? { otherText: "" }
                    : {}),
                });
              }}
              disabled={isDisabled}
            />
          </div>
        ))}
      </div>
      {hasOther && (
        <div className="mt-3 w-full">
          <FloatingInput
            id={`other-${field.id}`}
            type="text"
            label="Especificar Otros"
            widthClass="w-full"
            required={field.required}
            defaultValue={otherTextValue}
            onBlur={(e) => setAnswer(field, { otherText: e.target.value })}
            disabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export const FIELD_RENDERERS = {
  text: TextRenderer,
  number: NumberRenderer,
  date: DateRenderer,
  select: SelectRenderer,
  "multi-select": MultiSelectRenderer,
  matrix: MatrixRenderer,
  checkbox: CheckboxRenderer,
  textarea: TextareaRenderer,
  table: TableRenderer,
  "long-text": LongTextRenderer,
  "multi-checkbox": MultiCheckboxRenderer,
};
