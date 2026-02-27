import React from "react";
import Select from "react-select";

export const SelectInput = ({
  options = [],
  isMulti = false,
  required = false,
  value,
  onChange,
  className = "",
}) => {
  return (
    <Select
      className={`w-full ${className}`}
      options={options}
      isClearable
      isSearchable
      isMulti={isMulti}
      required={required}
      value={value}
      onChange={onChange}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
    />
  );
};
