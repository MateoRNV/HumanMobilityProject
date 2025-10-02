import React from "react";

export const TextareaField = ({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  ...props
}) => {
  return (
    <div className="relative w-full my-4">
      <textarea
        id={id}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange}
        placeholder={placeholder ?? "Escribe aquí..."}
        className="peer h-28 w-full resize-none rounded-md border-2 border-slate-200 bg-white px-4 pt-6 pb-2 text-slate-900 transition-colors duration-200 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
};
