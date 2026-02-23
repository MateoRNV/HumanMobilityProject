import React from "react";

export const CheckboxInput = ({ checked, onChange, ...props }) => {
  const handleChange = (e) => {
    onChange?.(e.target.checked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="relative flex justify-center items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="peer h-3 w-3 cursor-pointer appearance-none rounded border border-gray-300 bg-white transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-1 checked:border-[var(--primary-color)] checked:bg-[var(--primary-color)]"
          {...props}
        />
        {/* Check Icon ✔️ */}
        <svg
          className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
    </label>
  );
};
