import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { FormRender } from "../../features/forms/FormRender";
import { personsApi } from "../../api/api.config";
import LoadingSpinner from "../../components/ui/Spinner/Spinner";
import toast from "react-hot-toast";

const FormRenderer = () => {
  const { slug, personaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formSchema, setFormSchema] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(location.state?.user || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const definition = await personsApi.getDefinition(slug);
        const schema = definition.configuracion || definition;
        setFormSchema(schema);

        const formData = await personsApi.getForm(personaId, slug);
        if (formData && formData.respuestas) {
          setAnswerData(formData);
        }
      } catch (error) {
        toast.error("Error al cargar el formulario. Verifique su conexión.");
      } finally {
        setLoading(false);
      }
    };

    if (slug && personaId) {
      fetchData();
    }
  }, [slug, personaId]);

  useEffect(() => {
    if (userData || !personaId) return;
    personsApi
      .getOne(personaId)
      .then(setUserData)
      .catch((e) => {
        console.error("Error al recuperar datos del usuario", e);
      });
  }, [personaId, userData]);

  const handleSave = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        version_cuestionario: formSchema.version || 1,
        respuestas: data.answers,
      };

      await personsApi.saveForm(personaId, slug, payload);
      toast.success("Información guardada correctamente");

      navigate("/menu");
    } catch (error) {
      toast.error("Error al guardar la información.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-red-600">
          No se encontró la definición del formulario "{slug}"
        </h2>
        <button className="btn mt-4" onClick={() => navigate("/menu")}>
          Volver al Menú
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16 relative font-sans text-gray-900">
      <div
        onClick={() => navigate("/menu")}
        className="material-symbols-outlined absolute cursor-pointer top-8 left-8 text-3xl text-[#273a71] hover:text-[#1e2d5c] transition-colors bg-white p-2 rounded-full shadow-sm"
        title="Volver al menú"
      >
        arrow_back
      </div>

      <div className="w-full text-center mt-2 mb-6 px-12">
        <h1 className="text-sm font-bold text-[#d72836] bg-red-50 inline-block px-3 py-1 rounded-md border border-red-200 uppercase tracking-wider">
          {`Caso No. ${userData?.numeroCaso || "..."}`}
        </h1>
        {userData && (
          <p className="text-gray-600 mt-3 text-lg font-medium">
            Usuario:{" "}
            <span className="font-bold text-[#273a71]">
              {userData.nombreCompleto}
            </span>
            {userData?.documento
              ? ` | Identificación: ${userData.documento}`
              : ""}
          </p>
        )}
      </div>

      <div className="w-full">
        <FormRender
          formSchema={formSchema}
          initialAnswers={answerData?.respuestas || []}
          onSubmit={handleSave}
          onCancel={() => navigate("/menu")}
          lastUpdate={answerData?.fecha_modificacion || null}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default FormRenderer;
