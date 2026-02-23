import React from "react";

export const TextareaField = ({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  required,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full text-left">
      <textarea
        id={id}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange}
        placeholder={placeholder || label || "Escribe aquí..."}
        required={required}
        className="h-32 w-full resize-y px-3 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] transition-colors"
        {...props}
      />
    </div>
  );
};
