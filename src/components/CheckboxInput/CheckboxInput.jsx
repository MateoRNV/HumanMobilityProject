import React from "react";

export const CheckboxInput = ({ checked, onChange, ...props }) => {
  const handleChange = (e) => {
    onChange?.(e.target.checked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="relative flex">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-300"
          {...props}
        />
        {/* Check Icon ✔️ */}
        <svg
          className="pointer-events-none absolute left-0 top-0 h-5 w-5 text-blue-600 opacity-0 peer-checked:opacity-100 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </label>
  );
};
