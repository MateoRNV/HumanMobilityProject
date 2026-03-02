import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#6366f1",
  "#14b8a6",
];

const truncate = (str, max = 20) =>
  str.length > max ? str.slice(0, max) + "…" : str;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 text-sm max-w-xs">
      <p className="font-semibold text-gray-800 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-gray-600">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.fill || entry.color }}
          />
          <span className="truncate">{entry.name}:</span>
          <span className="font-semibold text-gray-800 ml-auto">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CrossTabChart = ({ data }) => {
  const [viewMode, setViewMode] = useState("chart");

  if (!data || !data.rows?.length) {
    return (
      <div className="w-full h-72 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            pivot_table_chart
          </span>
          <p className="text-sm font-medium">Sin datos cruzados</p>
          <p className="text-xs mt-1">
            Selecciona dos campos con respuestas en común
          </p>
        </div>
      </div>
    );
  }

  const { rows, seriesKeys, fieldA, fieldB } = data;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {fieldA?.title} × {fieldB?.title}
          </h3>
          <p className="text-xs text-gray-400">
            {rows.length} categoría{rows.length !== 1 ? "s" : ""} en eje X,{" "}
            {seriesKeys.length} en desglose
          </p>
        </div>
        <div className="flex bg-gray-100 rounded-md p-0.5 gap-0.5">
          <button
            onClick={() => setViewMode("chart")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "chart"
                ? "bg-white text-[#273a71] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="material-symbols-outlined text-sm align-middle mr-0.5">
              bar_chart
            </span>
            Gráfico
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "table"
                ? "bg-white text-[#273a71] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="material-symbols-outlined text-sm align-middle mr-0.5">
              table_chart
            </span>
            Tabla
          </button>
        </div>
      </div>

      {viewMode === "chart" ? (
        <div className="p-6">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={rows}
              margin={{ top: 10, right: 20, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v) => truncate(v, 16)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              {seriesKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={COLORS[i % COLORS.length]}
                  radius={
                    i === seriesKeys.length - 1 ? [4, 4, 0, 0] : undefined
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 sticky left-0 bg-gray-50">
                  {fieldA?.title}
                </th>
                {seriesKeys.map((key) => (
                  <th
                    key={key}
                    className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-bold text-gray-800">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-gray-800 sticky left-0 bg-white">
                    {row.name}
                  </td>
                  {seriesKeys.map((key) => {
                    const val = row[key] || 0;
                    return (
                      <td
                        key={key}
                        className={`text-center px-4 py-2.5 tabular-nums ${
                          val > 0 ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {val || "-"}
                      </td>
                    );
                  })}
                  <td className="text-center px-4 py-2.5 font-bold text-gray-800 tabular-nums">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CrossTabChart;
