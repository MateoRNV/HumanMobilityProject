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
        className="peer h-28 w-full resize-none rounded-md border border-[#cbd5e1] font-['Work_Sans'] bg-white px-4 pt-6 pb-2 text-[#1e293b] transition-colors duration-200 placeholder-transparent focus:outline-none focus:border-[#273a71] focus:ring-1 focus:ring-[#273a71]"
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-2 text-xs font-['Work_Sans'] font-medium text-[#64748b] transition-all duration-200 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:font-medium peer-focus:top-2 peer-focus:text-[#273a71]"
      >
        {label}
      </label>
    </div>
  );
};
