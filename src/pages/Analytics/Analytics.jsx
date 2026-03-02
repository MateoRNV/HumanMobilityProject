import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { analyticsApi } from "../../api/api.config";
import { DynamicChart } from "../../components/analytics/DynamicChart";
import OverviewPanel from "../../components/analytics/OverviewPanel";
import DateRangeFilter from "../../components/analytics/DateRangeFilter";
import TimeSeriesChart from "../../components/analytics/TimeSeriesChart";
import CrossTabChart from "../../components/analytics/CrossTabChart";
import LoadingSpinner from "../../components/ui/Spinner/Spinner";

const FORM_OPTIONS = [
  { slug: "triaje", label: "Triaje", icon: "assignment", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { slug: "social", label: "Trabajo Social", icon: "group", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { slug: "psicologico", label: "Psicología", icon: "psychology", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { slug: "legal", label: "Legal", icon: "balance", color: "text-amber-600 bg-amber-50 border-amber-200" },
];

const CHART_TYPES = [
  { value: "bar", label: "Barras", icon: "bar_chart" },
  { value: "pie", label: "Circular", icon: "pie_chart" },
  { value: "line", label: "Líneas", icon: "trending_up" },
  { value: "table", label: "Tabla", icon: "table_chart" },
];

const MODE_TABS = [
  { value: "single", label: "Campo Individual", icon: "bar_chart" },
  { value: "timeseries", label: "Serie Temporal", icon: "timeline" },
  { value: "crosstab", label: "Análisis Cruzado", icon: "pivot_table_chart" },
];

const Analytics = () => {
  const navigate = useNavigate();

  // Global state
  const [selectedSlug, setSelectedSlug] = useState("triaje");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [mode, setMode] = useState("single");

  // Fields
  const [chartableFields, setChartableFields] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);

  // Overview
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Single field mode
  const [selectedCampoId, setSelectedCampoId] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [stats, setStats] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);

  // Time series mode
  const [tsFieldId, setTsFieldId] = useState(null);
  const [tsData, setTsData] = useState(null);
  const [tsLoading, setTsLoading] = useState(false);

  // Cross-tab mode
  const [crossFieldA, setCrossFieldA] = useState(null);
  const [crossFieldB, setCrossFieldB] = useState(null);
  const [crossTabData, setCrossTabData] = useState(null);
  const [crossLoading, setCrossLoading] = useState(false);

  // Derived
  const fieldsBySection = useMemo(() => {
    const sections = new Map();
    for (const field of chartableFields) {
      const sec = field.section || "General";
      if (!sections.has(sec)) sections.set(sec, []);
      sections.get(sec).push(field);
    }
    return sections;
  }, [chartableFields]);

  const dateFields = useMemo(
    () => chartableFields.filter((f) => f.type === "date"),
    [chartableFields],
  );

  const currentField = chartableFields.find((f) => f.id === selectedCampoId);
  const currentForm = FORM_OPTIONS.find((f) => f.slug === selectedSlug);

  // ─── Effects ─────────────────────────────────────────────

  // Load chartable fields on slug change
  useEffect(() => {
    let cancelled = false;
    setFieldsLoading(true);
    setChartableFields([]);
    setSelectedCampoId(null);
    setTsFieldId(null);
    setCrossFieldA(null);
    setCrossFieldB(null);

    analyticsApi
      .getChartableFields(selectedSlug)
      .then((fields) => {
        if (cancelled) return;
        setChartableFields(fields);
        if (fields.length > 0) setSelectedCampoId(fields[0].id);
        const firstDate = fields.find((f) => f.type === "date");
        if (firstDate) setTsFieldId(firstDate.id);
        if (fields.length >= 2) {
          setCrossFieldA(fields[0].id);
          setCrossFieldB(fields[1].id);
        }
      })
      .catch(() => !cancelled && toast.error("Error al cargar campos"))
      .finally(() => !cancelled && setFieldsLoading(false));

    return () => { cancelled = true; };
  }, [selectedSlug]);

  // Load overview on slug/filter change
  useEffect(() => {
    let cancelled = false;
    setOverviewLoading(true);

    analyticsApi
      .getOverview(selectedSlug, dateFilter)
      .then((data) => !cancelled && setOverview(data))
      .catch(() => !cancelled && setOverview(null))
      .finally(() => !cancelled && setOverviewLoading(false));

    return () => { cancelled = true; };
  }, [selectedSlug, dateFilter]);

  // Load single field distribution
  useEffect(() => {
    if (!selectedCampoId || mode !== "single") return;
    let cancelled = false;
    setChartLoading(true);

    analyticsApi
      .getFieldDistribution(selectedSlug, selectedCampoId, dateFilter)
      .then((data) => !cancelled && setStats(data))
      .catch(() => !cancelled && toast.error("Error al cargar análisis"))
      .finally(() => !cancelled && setChartLoading(false));

    return () => { cancelled = true; };
  }, [selectedSlug, selectedCampoId, dateFilter, mode]);

  // Load time series
  useEffect(() => {
    if (!tsFieldId || mode !== "timeseries") return;
    let cancelled = false;
    setTsLoading(true);

    analyticsApi
      .getTimeSeries(selectedSlug, tsFieldId, dateFilter)
      .then((data) => !cancelled && setTsData(data))
      .catch(() => !cancelled && toast.error("Error al cargar serie temporal"))
      .finally(() => !cancelled && setTsLoading(false));

    return () => { cancelled = true; };
  }, [selectedSlug, tsFieldId, dateFilter, mode]);

  // Load cross-tab
  useEffect(() => {
    if (!crossFieldA || !crossFieldB || mode !== "crosstab") return;
    if (crossFieldA === crossFieldB) return;
    let cancelled = false;
    setCrossLoading(true);

    analyticsApi
      .getCrossTab(selectedSlug, crossFieldA, crossFieldB, dateFilter)
      .then((data) => !cancelled && setCrossTabData(data))
      .catch(() => !cancelled && toast.error("Error al cargar análisis cruzado"))
      .finally(() => !cancelled && setCrossLoading(false));

    return () => { cancelled = true; };
  }, [selectedSlug, crossFieldA, crossFieldB, dateFilter, mode]);

  // ─── Field selector helper ──────────────────────────────

  const FieldSelect = ({ value, onChange, label, exclude }) => (
    <div className="flex-1 flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#273a71] focus:ring-1 focus:ring-[#273a71] outline-none transition-colors bg-white text-gray-800 text-sm"
      >
        <option value="">-- Selecciona --</option>
        {[...fieldsBySection.entries()].map(([section, fields]) => (
          <optgroup key={section} label={section}>
            {fields
              .filter((f) => f.id !== exclude)
              .map((field) => (
                <option key={field.id} value={field.id}>
                  {field.title} ({field.type})
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#273a71] to-[#1e2d5c] text-white px-8 py-5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/menu", { state: { activeTab: "analytics" } })}
            className="material-symbols-outlined text-2xl hover:text-blue-200 transition-colors"
            title="Volver al menú"
          >
            arrow_back
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-blue-200/80 text-sm mt-0.5">
              Análisis dinámico de respuestas
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {/* Form tabs + date filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {FORM_OPTIONS.map((form) => (
                <button
                  key={form.slug}
                  onClick={() => setSelectedSlug(form.slug)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-all ${
                    selectedSlug === form.slug
                      ? `${form.color} border-current shadow-sm`
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {form.icon}
                  </span>
                  {form.label}
                </button>
              ))}
            </div>
            <DateRangeFilter value={dateFilter} onChange={setDateFilter} />
          </div>

          {/* Overview Panel */}
          <OverviewPanel data={overview} loading={overviewLoading} />

          {/* Mode tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {MODE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setMode(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === tab.value
                    ? "bg-white text-[#273a71] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Mode: Single Field ────────────────────────── */}
          {mode === "single" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  {fieldsLoading ? (
                    <div className="flex-1 h-[42px] bg-gray-100 rounded-lg animate-pulse" />
                  ) : (
                    <FieldSelect
                      value={selectedCampoId}
                      onChange={setSelectedCampoId}
                      label="Campo a analizar"
                    />
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Visualización
                    </label>
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5">
                      {CHART_TYPES.map((ct) => (
                        <button
                          key={ct.value}
                          onClick={() => setChartType(ct.value)}
                          title={ct.label}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                            chartType === ct.value
                              ? "bg-white text-[#273a71] shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {ct.icon}
                          </span>
                          <span className="hidden sm:inline">{ct.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {stats && !chartLoading && (
                    <div className="flex gap-3">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-center min-w-[80px]">
                        <div className="text-xl font-bold text-blue-600 tabular-nums">
                          {stats.totalResponses}
                        </div>
                        <div className="text-[10px] text-blue-500 font-medium uppercase tracking-wider">
                          Respuestas
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {chartLoading ? (
                <div className="flex justify-center items-center h-80">
                  <LoadingSpinner />
                </div>
              ) : stats && selectedCampoId ? (
                <div className="space-y-3">
                  {currentField && (
                    <div className="flex items-center justify-between px-1">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          {currentForm?.label} — {currentField.type}
                        </p>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {currentField.title}
                        </h2>
                      </div>
                    </div>
                  )}
                  <DynamicChart type={chartType} data={stats.data} />
                  {stats.emptyResponses > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 px-1">
                      <span className="material-symbols-outlined text-base">
                        info
                      </span>
                      {stats.emptyResponses} de{" "}
                      {stats.totalResponses + stats.emptyResponses} formularios
                      no respondieron este campo
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* ─── Mode: Time Series ─────────────────────────── */}
          {mode === "timeseries" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Campo de fecha
                    </label>
                    {dateFields.length === 0 ? (
                      <div className="text-sm text-gray-400 py-2">
                        No hay campos de fecha en este cuestionario
                      </div>
                    ) : (
                      <select
                        value={tsFieldId || ""}
                        onChange={(e) => setTsFieldId(e.target.value)}
                        className="px-3 py-2.5 rounded-lg border border-gray-300 focus:border-[#273a71] focus:ring-1 focus:ring-[#273a71] outline-none transition-colors bg-white text-gray-800 text-sm"
                      >
                        {dateFields.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {tsLoading ? (
                <div className="flex justify-center items-center h-80">
                  <LoadingSpinner />
                </div>
              ) : (
                <TimeSeriesChart data={tsData} />
              )}
            </div>
          )}

          {/* ─── Mode: Cross-Tab ───────────────────────────── */}
          {mode === "crosstab" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <FieldSelect
                    value={crossFieldA}
                    onChange={setCrossFieldA}
                    label="Campo eje X"
                    exclude={crossFieldB}
                  />
                  <div className="flex items-end pb-2">
                    <span className="material-symbols-outlined text-gray-400">
                      close
                    </span>
                  </div>
                  <FieldSelect
                    value={crossFieldB}
                    onChange={setCrossFieldB}
                    label="Campo desglose"
                    exclude={crossFieldA}
                  />
                </div>
                {crossFieldA === crossFieldB && crossFieldA && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      warning
                    </span>
                    Los dos campos deben ser diferentes
                  </p>
                )}
              </div>

              {crossLoading ? (
                <div className="flex justify-center items-center h-80">
                  <LoadingSpinner />
                </div>
              ) : (
                <CrossTabChart data={crossTabData} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
