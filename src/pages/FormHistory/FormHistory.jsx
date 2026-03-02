import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { personsApi } from "../../api/api.config";
import LoadingSpinner from "../../components/ui/Spinner/Spinner";
import toast from "react-hot-toast";
import TimelineView from "./views/TimelineView";
import FormView from "./views/FormView";
import TableView from "./views/TableView";

const FORM_LABELS = {
  triaje: "Triaje",
  social: "Trabajo Social",
  psicologico: "Psicología",
  legal: "Legal",
};

const VIEWS = [
  {
    id: "timeline",
    label: "Cronología",
    icon: "timeline",
    description: "Registros por fecha",
  },
  {
    id: "form",
    label: "Formulario",
    icon: "article",
    description: "Vista de formulario",
  },
  {
    id: "table",
    label: "Tabla",
    icon: "table_chart",
    description: "Comparar campos",
  },
  // Espacio reservado para gráficos futuros:
  // { id: "charts", label: "Gráficos", icon: "bar_chart", description: "Visualización", disabled: true },
];

const FormHistory = () => {
  const { slug, personaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [history, setHistory] = useState([]);
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("timeline");

  const userData = location.state?.user || null;

  useEffect(() => {
    if (!slug || !personaId) return;

    const fetchAll = async () => {
      try {
        const [historyData, definitionData] = await Promise.all([
          personsApi.getFormHistory(personaId, slug),
          personsApi.getDefinition(slug),
        ]);
        setHistory(historyData);
        setFormSchema(definitionData.configuracion || definitionData);
      } catch {
        toast.error("Error al cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [slug, personaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const renderView = () => {
    const props = { history, formSchema };
    switch (activeView) {
      case "timeline":
        return <TimelineView {...props} />;
      case "form":
        return <FormView {...props} />;
      case "table":
        return <TableView {...props} />;
      default:
        return <TimelineView {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-[#273a71] text-white px-8 py-5 flex items-center gap-6 shadow-md">
        <button
          onClick={() => navigate("/menu", { state: { openUser: userData } })}
          className="material-symbols-outlined text-2xl hover:text-blue-200 transition-colors flex-shrink-0"
          title="Volver al menú"
        >
          arrow_back
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold bg-red-500/80 px-2 py-0.5 rounded">
              {userData
                ? `Caso ${userData.numeroCaso}`
                : `Persona #${personaId}`}
            </span>
            {userData && (
              <span className="text-sm font-medium text-blue-100 truncate">
                {userData.nombreCompleto}
              </span>
            )}
          </div>
          <h1 className="text-lg font-bold mt-0.5">
            Historial — {FORM_LABELS[slug] ?? slug}
          </h1>
        </div>
        <span className="text-sm text-blue-200 flex-shrink-0">
          {history.length} {history.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de modos de visualización */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col py-4 gap-1 flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-2">
            Visualización
          </p>
          {VIEWS.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors text-left ${
                activeView === view.id
                  ? "bg-[#273a71] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="material-symbols-outlined text-xl flex-shrink-0">
                {view.icon}
              </span>
              <div>
                <div className="text-sm font-semibold leading-tight">
                  {view.label}
                </div>
                <div
                  className={`text-[10px] leading-tight ${
                    activeView === view.id ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {view.description}
                </div>
              </div>
            </button>
          ))}

          {/* Placeholder para vistas futuras */}
          <div className="mt-auto mx-2 px-4 py-3 rounded-lg border border-dashed border-gray-200">
            <div className="flex items-center gap-3 opacity-40">
              <span className="material-symbols-outlined text-xl">
                bar_chart
              </span>
              <div>
                <div className="text-sm font-semibold text-gray-500">
                  Gráficos
                </div>
                <div className="text-[10px] text-gray-400">Próximamente</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Área principal */}
        <main className="flex-1 overflow-auto p-6">{renderView()}</main>
      </div>
    </div>
  );
};

export default FormHistory;
