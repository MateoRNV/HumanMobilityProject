import React from "react";

const KpiCard = ({ icon, iconColor, label, value, sub }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 min-w-0">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div className="min-w-0">
      <div className="text-2xl font-bold text-gray-800 tabular-nums leading-tight">
        {value}
      </div>
      <div className="text-xs text-gray-500 font-medium truncate">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 truncate">{sub}</div>}
    </div>
  </div>
);

const MiniBar = ({ items = [], colorMap }) => {
  if (!items.length) return <span className="text-xs text-gray-400">Sin datos</span>;
  const max = items[0]?.value || 1;

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-24 truncate text-right shrink-0">
            {item.label}
          </span>
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor:
                  colorMap?.[i] || ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][i % 5],
              }}
            />
          </div>
          <span className="text-xs text-gray-500 tabular-nums w-6 text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const OverviewPanel = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4 h-20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          icon="people"
          iconColor="bg-blue-50 text-blue-600"
          label="Personas"
          value={data.totalPersonas}
        />
        <KpiCard
          icon="description"
          iconColor="bg-emerald-50 text-emerald-600"
          label="Envíos"
          value={data.totalSubmissions}
        />
        <KpiCard
          icon="warning"
          iconColor="bg-amber-50 text-amber-600"
          label="En situación de vulnerabilidad"
          value={data.vulnerabilityCount}
          sub={
            data.totalPersonas > 0
              ? `${((data.vulnerabilityCount / data.totalPersonas) * 100).toFixed(0)}% del total`
              : undefined
          }
        />
        <KpiCard
          icon="public"
          iconColor="bg-purple-50 text-purple-600"
          label="Países de origen"
          value={data.topPaises?.length || 0}
          sub={data.topPaises?.[0]?.label ? `Principal: ${data.topPaises[0].label}` : undefined}
        />
      </div>

      {/* Mini charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Top Motivos de Consulta
          </h4>
          <MiniBar items={data.topMotivos} />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Países de Origen
          </h4>
          <MiniBar
            items={data.topPaises}
            colorMap={["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]}
          />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Distribución por Sexo
          </h4>
          <MiniBar
            items={data.bySexo}
            colorMap={["#06b6d4", "#ec4899", "#f59e0b", "#6b7280"]}
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
