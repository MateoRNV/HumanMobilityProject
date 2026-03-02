import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
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

const truncate = (str, max = 28) =>
  str.length > max ? str.slice(0, max) + "…" : str;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percentage } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-800 mb-1">{name}</p>
      <p className="text-gray-600">
        {value} respuesta{value !== 1 ? "s" : ""}{" "}
        <span className="text-gray-400">({percentage}%)</span>
      </p>
    </div>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) => {
  if (percentage < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {truncate(name, 20)} ({percentage}%)
    </text>
  );
};

export const DynamicChart = ({ type = "bar", data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="material-symbols-outlined text-5xl mb-3 block">
            data_exploration
          </span>
          <p className="text-sm font-medium">Sin datos disponibles</p>
          <p className="text-xs mt-1">Aún no hay respuestas para este campo</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label || "Sin nombre",
    value: item.value || 0,
    percentage: item.percentage ?? 0,
  }));

  if (type === "table") {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-700">
                Respuesta
              </th>
              <th className="text-center px-5 py-3.5 font-semibold text-gray-700 w-28">
                Total
              </th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-700 w-48">
                Porcentaje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {chartData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/80 transition-colors"
              >
                <td className="px-5 py-3 text-gray-800 font-medium">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    {row.name}
                  </div>
                </td>
                <td className="text-center px-5 py-3 text-gray-700 font-semibold tabular-nums">
                  {row.value}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(row.percentage, 100)}%`,
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-gray-600 text-xs font-medium tabular-nums w-12 text-right">
                      {row.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "pie") {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-4">
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  label={PieLabel}
                  labelLine={false}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="md:w-56 p-5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
              Leyenda
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {chartData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-gray-700 truncate flex-1">
                    {item.name}
                  </span>
                  <span className="text-gray-400 tabular-nums text-xs">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "line") {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) => truncate(v, 18)}
            />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Default: bar chart
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(v) => truncate(v, 18)}
          />
          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
