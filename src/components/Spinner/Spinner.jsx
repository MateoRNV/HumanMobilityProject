import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">
        Cargando datos...
      </p>
    </div>
  );
};

export default LoadingSpinner;
