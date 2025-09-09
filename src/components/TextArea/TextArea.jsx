import React from "react";

export const TextareaField = ({ label, value, onChange, placeholder, ...props }) => {
  return (
    <div className="relative w-full my-4">
      <textarea
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer h-28 w-full resize-none rounded-md border border-gray-300 bg-transparent px-3 pt-4 text-sm text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...props}
      />
      <label
        className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
};
