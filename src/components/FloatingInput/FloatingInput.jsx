export const FloatingInput = (props) => {
  const {
    id,
    type = "text",
    label,
    widthClass = "w-96",
    inputFocusClass = "focus:border-blue-500",
    labelFocusClass = "peer-focus:text-blue-500",
    required = false,
  } = props;

  return (
    <div className={`relative ${widthClass}`}>
      <input
        type={type}
        id={id}
        className={`peer w-full px-4 pt-6 pb-2 text-slate-900 bg-white border-2 border-slate-200 rounded-lg ${inputFocusClass} focus:outline-none transition-colors duration-200 placeholder-transparent`}
        placeholder="Tu valor"
        required={required}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2 ${labelFocusClass}`}
      >
        {label}
      </label>
    </div>
  );
};
