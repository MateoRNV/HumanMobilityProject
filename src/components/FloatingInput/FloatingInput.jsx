export const FloatingInput = (props) => {
  const {
    id,
    type = "text",
    label,
    widthClass = "w-full",
    required = false,
    value,
    defaultValue,
    onChange,
    ...properties
  } = props;

  return (
    <div className={`flex flex-col gap-1.5 ${widthClass} text-left`}>
      <input
        type={type}
        id={id}
        placeholder={label || "Escribe aquí..."}
        className="w-full px-3 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] transition-colors"
        required={required}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange}
        autoComplete="off"
        {...properties}
      />
    </div>
  );
};
