import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-gray-600">
        {value} registro{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

const TimeSeriesChart = ({ data }) => {
  if (!data || !data.data?.length) {
    return (
      <div className="w-full h-72 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            timeline
          </span>
          <p className="text-sm font-medium">Sin datos temporales</p>
          <p className="text-xs mt-1">No hay registros en el rango seleccionado</p>
        </div>
      </div>
    );
  }

  const chartData = data.data.map((d) => ({
    name: d.period,
    value: d.count,
  }));

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {data.field?.title || "Serie Temporal"}
          </h3>
          <p className="text-xs text-gray-400">Agrupado por mes</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 text-center">
          <span className="text-lg font-bold text-blue-600 tabular-nums">
            {data.totalInRange}
          </span>
          <span className="text-[10px] text-blue-500 font-medium ml-1">
            total
          </span>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#tsGradient)"
              dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{
                r: 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
