import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { FormRender } from "../../components/FormRender";
import { personsApi } from "../../api.config";
import LoadingSpinner from "../../components/Spinner/Spinner";
import toast, { Toaster } from "react-hot-toast";

const FormRenderer = () => {
  const { slug, personaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formSchema, setFormSchema] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(location.state?.user || null);

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
        if (!userData) {
          try {
            const person = await personsApi.getOne(personaId);
            setUserData(person);
          } catch (e) {
            console.error("Error al recuperar datos del usuario", e);
          }
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
  }, [slug, personaId, userData]);

  const handleSave = async (data) => {
    try {
      const payload = {
        version_cuestionario: formSchema.version || 1,
        respuestas: data.answers,
      };

      await personsApi.saveForm(personaId, slug, payload);
      toast.success("Información guardada correctamente");

      navigate("/menu");
    } catch (error) {
      toast.error("Error al guardar la información.");
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
    <div className="mt-3 relative">
      <Toaster />
      <div
        onClick={() => navigate("/menu")}
        className="material-symbols-outlined absolute cursor-pointer top-0 left-4 text-2xl text-gray-600 hover:text-blue-600 transition-colors"
        title="Volver al menú"
      >
        arrow_back
      </div>

      <div className="w-full text-center mb-6 px-12">
        <h1 className="text-2xl font-bold text-gray-800">
          {`Caso No. ${userData.numeroCaso}`}
        </h1>
        {userData && (
          <p className="text-gray-600 mt-1">
            Usuario: <span className="font-semibold">{userData.nombre}</span>
            {userData?.documento
              ? ` - Identificacion: ${userData.documento}`
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
        />
      </div>
    </div>
  );
};

export default FormRenderer;
