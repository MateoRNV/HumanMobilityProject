import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import { personsApi } from "../../../api.config";
import LoadingSpinner from "../../../components/Spinner/Spinner";
import { FormRender } from "../../../components/FormRender";

const QuestionnaireEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [showSectionProps, setShowSectionProps] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [draggedSectionIdx, setDraggedSectionIdx] = useState(null);
  const [draggedFieldIdx, setDraggedFieldIdx] = useState(null);

  useEffect(() => {
    const fetchSchema = async () => {
      setIsLoading(true);
      try {
        const result = await personsApi.getDefinition(slug);

        let loadedConfig = null;
        const sourceData =
          result.configuracion ||
          result.configuracion_json ||
          (result.sections ? result : null);

        if (sourceData) {
          loadedConfig =
            typeof sourceData === "string"
              ? JSON.parse(sourceData)
              : sourceData;
        }

        if (loadedConfig) {
          const normalizedSections = (loadedConfig.sections || []).map(
            (sec) => ({
              ...sec,
              fields: (sec.fields || []).map((f) => ({
                ...f,
                placeholder: f.placeholder || f.placeHolder || "",
              })),
            }),
          );

          setConfig({
            version: result.version || loadedConfig.version || 1,
            slug: result.slug || loadedConfig.slug || slug,
            name:
              result.nombre || loadedConfig.name || loadedConfig.title || slug,
            title:
              result.nombre || loadedConfig.title || loadedConfig.name || slug,
            sections: normalizedSections,
          });

          if (normalizedSections.length > 0) {
            setSelectedSectionId(normalizedSections[0].id);
          }
        } else {
          throw new Error("Formato de esquema inválido");
        }
      } catch (error) {
        toast.error(
          "Mo se pudo cargar el esquema del backend. Usando datos Mock.",
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchSchema();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full bg-gray-50 items-center justify-center relative z-[100]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500 font-medium">
          Cargando definición del cuestionario...
        </p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex flex-col h-screen w-full bg-gray-50 items-center justify-center relative z-[100]">
        <p className="text-gray-500 font-medium mb-4">
          No se pudo cargar el cuestionario.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-[var(--primary-color)] hover:underline"
        >
          Volver
        </button>
      </div>
    );
  }

  // Derivations
  const selectedSection = config.sections?.find(
    (s) => s.id === selectedSectionId,
  );
  const selectedField = selectedSection?.fields?.find(
    (f) => f.id === selectedFieldId,
  );

  // Handlers
  const handleAddSection = () => {
    const newSectionId = `sec-${Date.now()}`;
    const newSection = {
      id: newSectionId,
      order: config.sections.length + 1,
      title: "Nueva Sección",
      fields: [],
    };
    setConfig({
      ...config,
      sections: [...config.sections, newSection],
    });
    setSelectedSectionId(newSectionId);
  };

  const handleDeleteSection = (secId) => {
    const newSections = config.sections.filter((s) => s.id !== secId);
    setConfig({ ...config, sections: newSections });
    if (selectedSectionId === secId) {
      setSelectedSectionId(newSections[0]?.id || null);
      setSelectedFieldId(null);
    }
  };

  const handleAddField = () => {
    if (!selectedSectionId) return;
    const newFieldId = `fld-${Date.now()}`;
    const newField = {
      id: newFieldId,
      order: selectedSection.fields.length + 1,
      title: "Nuevo Campo",
      type: "text",
    };

    const newSections = config.sections.map((s) => {
      if (s.id === selectedSectionId) {
        return { ...s, fields: [...s.fields, newField] };
      }
      return s;
    });

    setConfig({ ...config, sections: newSections });
    setSelectedFieldId(newFieldId);
  };

  const handleDeleteField = (fieldId) => {
    const newSections = config.sections.map((s) => {
      if (s.id === selectedSectionId) {
        return { ...s, fields: s.fields.filter((f) => f.id !== fieldId) };
      }
      return s;
    });
    setConfig({ ...config, sections: newSections });
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const handleUpdateField = (key, value) => {
    if (!selectedSectionId || !selectedFieldId) return;

    const newSections = config.sections.map((s) => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          fields: s.fields.map((f) => {
            if (f.id === selectedFieldId) {
              return { ...f, [key]: value };
            }
            return f;
          }),
        };
      }
      return s;
    });
    setConfig({ ...config, sections: newSections });
  };

  const handleUpdateSectionProps = (key, value) => {
    if (!selectedSectionId) return;
    const newSections = config.sections.map((s) => {
      if (s.id === selectedSectionId) {
        return { ...s, [key]: value };
      }
      return s;
    });
    setConfig({ ...config, sections: newSections });
  };

  const handleUpdateSectionTitle = (title) => {
    if (!selectedSectionId) return;
    const newSections = config.sections.map((s) => {
      if (s.id === selectedSectionId) {
        return { ...s, title };
      }
      return s;
    });
    setConfig({ ...config, sections: newSections });
  };

  const handleSectionDragStart = (e, index) => {
    e.dataTransfer.setData("sectionIdx", index);
    setDraggedSectionIdx(index);
  };

  const handleSectionDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("sectionIdx"));
    if (dragIndex === dropIndex || isNaN(dragIndex)) return;

    const newSections = [...config.sections];
    const [draggedItem] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, draggedItem);

    newSections.forEach((sec, idx) => {
      sec.order = idx + 1;
    });
    setConfig({ ...config, sections: newSections });
    setDraggedSectionIdx(null);
  };

  const handleFieldDragStart = (e, index) => {
    e.dataTransfer.setData("fieldIdx", index);
    setDraggedFieldIdx(index);
  };

  const handleFieldDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    const dragIndex = Number(e.dataTransfer.getData("fieldIdx"));
    if (dragIndex === dropIndex || isNaN(dragIndex) || !selectedSectionId)
      return;

    const newSections = config.sections.map((s) => {
      if (s.id === selectedSectionId) {
        const newFields = [...s.fields];
        const [draggedItem] = newFields.splice(dragIndex, 1);
        newFields.splice(dropIndex, 0, draggedItem);
        newFields.forEach((f, idx) => {
          f.order = idx + 1;
        });
        return { ...s, fields: newFields };
      }
      return s;
    });

    setConfig({ ...config, sections: newSections });
    setDraggedFieldIdx(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 fixed inset-0 z-[100] overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[var(--primary-color)] text-white shadow-md relative z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors text-white/90"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {config.name}
              <span className="text-xs font-semibold px-2 py-1 rounded bg-white/20 text-white shadow-inner">
                v{config.version}
              </span>
            </h1>
            <p className="text-sm font-medium text-blue-200">
              Slug: {config.slug} | Editando estructura
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-2 border border-transparent text-blue-100 bg-white/10 hover:bg-white/20 rounded-md font-medium text-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPreviewMode ? "edit" : "visibility"}
            </span>
            {isPreviewMode ? "Editor" : "Vista Previa"}
          </button>
          <button
            onClick={() => toast.success("Cambios guardados exitosamente")}
            className="px-4 py-2 bg-white text-[var(--primary-color)] shadow-sm hover:bg-blue-50 focus:ring-2 focus:ring-white/50 rounded-md font-bold text-sm transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Sidebar - Sections */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 hidden md:flex">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-gray-500">
                format_list_bulleted
              </span>
              Secciones
            </h2>
            <button
              onClick={handleAddSection}
              className="text-[var(--primary-color)] hover:bg-blue-50 p-1.5 rounded-md transition-colors"
              title="Añadir Sección"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {config.sections.map((sec, index) => (
              <div
                draggable
                onDragStart={(e) => handleSectionDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleSectionDrop(e, index)}
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setSelectedFieldId(null);
                  setShowSectionProps(false);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                  ${
                    selectedSectionId === sec.id
                      ? "border-[var(--primary-color)] bg-blue-50/30 ring-1 ring-[var(--primary-color)] shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${draggedSectionIdx === index ? "opacity-50 border-dashed" : ""}`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="text-gray-300 cursor-grab hover:text-gray-500 active:cursor-grabbing">
                    <span className="material-symbols-outlined text-[20px]">
                      drag_indicator
                    </span>
                  </div>
                  <div className="flex flex-col overflow-hidden w-full">
                    <span className="text-sm font-semibold text-gray-800 truncate select-none">
                      {index + 1}. {sec.title}
                    </span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5">
                      {sec.fields.length} campos
                    </span>
                  </div>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(sec.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded"
                    title="Eliminar Sección"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
            {config.sections.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No hay secciones
              </div>
            )}
          </div>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 bg-gray-50 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
          {selectedSection ? (
            <div className="w-full max-w-3xl">
              <div
                onClick={() => {
                  setShowSectionProps(!showSectionProps);
                  setSelectedFieldId(null);
                }}
                className={`mb-6 bg-[var(--primary-color)] p-6 rounded-2xl shadow-lg flex items-center justify-between gap-4 border border-white/10 relative overflow-hidden group/sec cursor-pointer transition-all duration-300 hover:bg-[#324891] hover:shadow-xl active:scale-[0.98]
                ${showSectionProps ? "ring-2 ring-white/40 ring-offset-2 ring-offset-[#3a5099] bg-[#3a5099]" : ""}`}
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover/sec:scale-110 transition-transform duration-500"></div>

                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-2 group/title">
                    <input
                      type="text"
                      value={selectedSection.title}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleUpdateSectionTitle(e.target.value)}
                      className="text-2xl font-bold text-white bg-transparent border-none outline-none w-full hover:bg-white/10 focus:bg-white/10 px-2 py-1.5 rounded-lg transition-all placeholder:text-blue-100/50 cursor-text"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-2">
                    <p className="text-blue-200 text-xs font-mono tracking-wider flex items-center gap-1">
                      ID: {selectedSection.id}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-blue-300/30"></span>
                    <p className="text-blue-200 text-xs font-medium uppercase tracking-tight flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">
                        info
                      </span>
                      Haz clic para editar propiedades
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddField();
                  }}
                  className="px-5 py-2.5 bg-white text-[var(--primary-color)] hover:bg-blue-50 shadow-md rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 relative z-10 ring-2 ring-transparent hover:ring-white/30"
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    add_circle
                  </span>
                  Añadir Campo
                </button>
              </div>

              {selectedSection.fields.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-400">
                      post_add
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    Sección sin campos
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 max-w-sm">
                    Esta sección está vacía. Añade campos para estructurar la
                    información del cuestionario.
                  </p>
                  <button
                    onClick={handleAddField}
                    className="px-5 py-2.5 bg-[var(--primary-color)] text-white hover:bg-[#1e2d5c] shadow-sm rounded-md font-medium text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    Añadir primer campo
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pb-20">
                  {selectedSection.fields.map((field, index) => (
                    <div
                      draggable
                      onDragStart={(e) => handleFieldDragStart(e, index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => handleFieldDrop(e, index)}
                      key={field.id}
                      onClick={() => {
                        setSelectedFieldId(field.id);
                        setShowSectionProps(false);
                      }}
                      className={`bg-white p-5 rounded-xl border transition-all cursor-pointer relative group
                        ${
                          selectedFieldId === field.id
                            ? "border-[var(--primary-color)] shadow-md ring-1 ring-[var(--primary-color)]"
                            : "border-gray-200 hover:border-gray-300 shadow-sm"
                        } ${draggedFieldIdx === index ? "opacity-50 border-dashed" : ""}`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab hover:text-gray-500 active:cursor-grabbing">
                        <span className="material-symbols-outlined text-[20px]">
                          drag_indicator
                        </span>
                      </div>

                      <div className="pl-6 flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 bg-gray-100/80 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider border border-gray-200">
                              {field.type}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              #{field.id}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {index + 1}. {field.title || "Sin Título"}
                            {field.required && (
                              <span
                                className="text-red-500 ml-1"
                                title="Campo requerido"
                              >
                                *
                              </span>
                            )}
                          </h4>
                          {field.placeholder && (
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">
                                edit_note
                              </span>
                              {field.placeholder}
                            </p>
                          )}
                          {(field.type === "select" ||
                            field.type === "multi-select") &&
                            field.options && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {field.options.map((opt, i) => (
                                  <span
                                    key={i}
                                    className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-md flex items-center gap-1"
                                  >
                                    {opt.label}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-gray-500 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 bg-white shadow-sm"
                            title="Ajustes del Campo"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFieldId(field.id);
                              setShowSectionProps(false);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              tune
                            </span>
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 bg-white shadow-sm"
                            title="Eliminar Campo"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.id);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-32 flex flex-col items-center text-gray-400 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl opacity-50">
                  data_object
                </span>
              </div>
              <p className="text-lg font-medium text-gray-600">
                Ninguna sección seleccionada
              </p>
              <p className="text-sm mt-1">
                Selecciona o crea una sección en el panel lateral para empezar a
                editar sus campos
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        {(selectedField || (selectedSection && showSectionProps)) && (
          <div className="w-80 lg:w-96 bg-white border-l border-gray-200 h-full overflow-y-auto shadow-sm flex flex-col z-20">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-gray-500">
                  {selectedField ? "tune" : "format_list_bulleted"}
                </span>
                {selectedField
                  ? "Propiedades del Campo"
                  : "Propiedades de Sección"}
              </h2>
              <button
                onClick={() => {
                  setSelectedFieldId(null);
                  setShowSectionProps(false);
                }}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="p-5 flex flex-col gap-6">
              {selectedField ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Identificador (ID)
                    </label>
                    <input
                      type="text"
                      value={selectedField.id}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 text-gray-500 rounded border border-gray-200 text-sm font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Título del Campo
                    </label>
                    <textarea
                      value={selectedField.title}
                      onChange={(e) =>
                        handleUpdateField("title", e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow text-sm resize-none shadow-sm"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Tipo de Entrada
                    </label>
                    <select
                      value={selectedField.type}
                      onChange={(e) =>
                        handleUpdateField("type", e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow text-sm shadow-sm"
                    >
                      <option value="text">Texto Corto (text)</option>
                      <option value="textarea">Texto Largo (textarea)</option>
                      <option value="number">Número (number)</option>
                      <option value="date">Fecha (date)</option>
                      <option value="select">Selección Única (select)</option>
                      <option value="multi-select">
                        Selección Múltiple (multi-select)
                      </option>
                      <option value="checkbox">Verificación (checkbox)</option>
                      <option value="matrix">Matriz (matrix)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Placeholder (Opcional)
                    </label>
                    <input
                      type="text"
                      value={selectedField.placeholder || ""}
                      onChange={(e) =>
                        handleUpdateField("placeholder", e.target.value)
                      }
                      placeholder="Ej. Escribe aquí..."
                      className="w-full px-3 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow text-sm shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id={`req-${selectedField.id}`}
                      checked={selectedField.required || false}
                      onChange={(e) =>
                        handleUpdateField("required", e.target.checked)
                      }
                      className="w-4 h-4 text-[var(--primary-color)] rounded border-gray-300 focus:ring-[var(--primary-color)]"
                    />
                    <label
                      htmlFor={`req-${selectedField.id}`}
                      className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                    >
                      Campo Obligatorio
                    </label>
                  </div>

                  {(selectedField.type === "select" ||
                    selectedField.type === "multi-select") && (
                    <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Opciones
                        </label>
                        <button
                          className="text-[var(--primary-color)] text-xs font-semibold hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                          onClick={() => {
                            const newOptions = [
                              ...(selectedField.options || []),
                              {
                                label: "Nueva Opción",
                                value: `opt_${Date.now()}`,
                              },
                            ];
                            handleUpdateField("options", newOptions);
                          }}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            add
                          </span>{" "}
                          Añadir Opción
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        {selectedField.options &&
                        selectedField.options.length > 0 ? (
                          selectedField.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 group/opt relative"
                            >
                              <div className="text-gray-300 cursor-grab hover:text-gray-500">
                                <span className="material-symbols-outlined text-[16px]">
                                  drag_indicator
                                </span>
                              </div>
                              <input
                                type="text"
                                value={opt.label}
                                onChange={(e) => {
                                  const newOptions = [...selectedField.options];
                                  newOptions[idx] = {
                                    ...newOptions[idx],
                                    label: e.target.value,
                                    value: e.target.value
                                      .toLowerCase()
                                      .replace(/\s+/g, "_"),
                                  };
                                  handleUpdateField("options", newOptions);
                                }}
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded shrink min-w-0 text-sm focus:border-[var(--primary-color)] outline-none"
                              />
                              <button
                                onClick={() => {
                                  const newOptions =
                                    selectedField.options.filter(
                                      (_, i) => i !== idx,
                                    );
                                  handleUpdateField("options", newOptions);
                                }}
                                className="text-gray-400 hover:text-red-500 p-1 rounded opacity-0 group-hover/opt:opacity-100 transition-opacity"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  close
                                </span>
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-center text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                            Sin opciones configuradas
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Identificador (ID)
                    </label>
                    <input
                      type="text"
                      value={selectedSection.id}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 text-gray-500 rounded border border-gray-200 text-sm font-mono cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Título de la Sección
                    </label>
                    <textarea
                      value={selectedSection.title}
                      onChange={(e) =>
                        handleUpdateSectionProps("title", e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow text-sm resize-none shadow-sm"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="enable-observations"
                      checked={selectedSection.observations || false}
                      onChange={(e) =>
                        handleUpdateSectionProps(
                          "observations",
                          e.target.checked,
                        )
                      }
                      className="w-5 h-5 text-[var(--primary-color)] rounded border-gray-300 focus:ring-[var(--primary-color)]"
                    />
                    <div className="flex flex-col">
                      <label
                        htmlFor="enable-observations"
                        className="text-sm font-bold text-gray-800 cursor-pointer"
                      >
                        Habilitar Observaciones
                      </label>
                      <p className="text-[10px] text-gray-500">
                        Añade un campo de texto al final de la sección
                      </p>
                    </div>
                  </div>

                  {selectedSection.observations && (
                    <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Etiqueta de Observaciones
                      </label>
                      <input
                        type="text"
                        value={selectedSection.observationsLabel || ""}
                        onChange={(e) =>
                          handleUpdateSectionProps(
                            "observationsLabel",
                            e.target.value,
                          )
                        }
                        placeholder="Ej. Observaciones finales:"
                        className="w-full px-3 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-300 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-shadow text-sm shadow-sm"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview View Overlay */}
      {isPreviewMode && (
        <div className="absolute inset-0 top-[73px] bg-white/40 backdrop-blur-md z-[150] overflow-y-auto flex flex-col items-center py-12 px-4 scroll-smooth">
          <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col relative mb-12 animate-in fade-in zoom-in duration-300">
            <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-20 rounded-t-2xl backdrop-blur-md bg-white/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[var(--primary-color)]">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">
                    Vista Previa Interactiva
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Visualización en tiempo real del cuestionario
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-all border border-gray-200"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
                Cerrar Preview
              </button>
            </div>
            <div className="p-8 md:p-12">
              <FormRender
                formSchema={config}
                initialAnswers={[]}
                onSubmit={(data) =>
                  toast.success("¡Envío de prueba capturado! (Simulado)")
                }
                onCancel={() => setIsPreviewMode(false)}
                lastUpdate={null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireEditor;
