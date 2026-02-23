export const FloatingInput = (props) => {
  const {
    id,
    type = "text",
    label,
    widthClass = "w-96",
    inputFocusClass = "focus:border-[#273a71]",
    labelFocusClass = "peer-focus:text-[#273a71]",
    required = false,
    value,
    defaultValue,
    onChange,
    ...properties
  } = props;

  return (
    <div className={`relative ${widthClass}`}>
      <input
        type={type}
        id={id}
        className={`peer w-full px-4 pt-6 pb-2 text-[#1e293b] font-['Work_Sans'] bg-white border border-[#cbd5e1] rounded-md ${inputFocusClass} focus:outline-none focus:ring-1 focus:ring-[#273a71] transition-all duration-200 placeholder-transparent`}
        placeholder="Tu valor"
        required={required}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange}
        autoComplete="off"
        {...properties}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-2 text-xs font-['Work_Sans'] font-medium text-[#64748b] transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:font-medium peer-focus:top-2 ${labelFocusClass}`}
      >
        {label}
      </label>
    </div>
  );
};
