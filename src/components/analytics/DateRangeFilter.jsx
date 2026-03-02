import React from "react";

const DateRangeFilter = ({ value = {}, onChange }) => {
  const handleChange = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  const hasFilter = value.from || value.to;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="material-symbols-outlined text-gray-400 text-lg">
        date_range
      </span>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">Desde</label>
        <input
          type="date"
          value={value.from || ""}
          onChange={(e) => handleChange("from", e.target.value)}
          className="px-2.5 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 focus:border-[#273a71] focus:ring-1 focus:ring-[#273a71] outline-none bg-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">Hasta</label>
        <input
          type="date"
          value={value.to || ""}
          onChange={(e) => handleChange("to", e.target.value)}
          className="px-2.5 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 focus:border-[#273a71] focus:ring-1 focus:ring-[#273a71] outline-none bg-white"
        />
      </div>
      {hasFilter && (
        <button
          onClick={() => onChange({ from: "", to: "" })}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          Limpiar
        </button>
      )}
    </div>
  );
};

export default DateRangeFilter;
