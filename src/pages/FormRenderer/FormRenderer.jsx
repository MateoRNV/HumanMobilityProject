import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FormRender } from "../../components/FormRender";
import { personsApi } from "../../api.config";
import LoadingSpinner from "../../components/Spinner/Spinner";
import toast, { Toaster } from "react-hot-toast";

const FormRenderer = () => {
  const { slug, personaId } = useParams();
  const navigate = useNavigate();

  const [formSchema, setFormSchema] = useState(null);
  const [initialAnswers, setInitialAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userDocument, setUserDocument] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const definition = await personsApi.getDefinition(slug);
        const schema = definition.configuracion || definition;
        setFormSchema(schema);

        const formData = await personsApi.getForm(personaId, slug);

        if (formData && formData.respuestasJson) {
          const parsedAnswers = JSON.parse(formData.respuestasJson);
          setInitialAnswers(parsedAnswers.respuestas || []);
        }
        try {
          const person = await personsApi.getOne(personaId);
          setUserName(person.nombre);
          setUserDocument(person.documento);
        } catch (e) {
          toast.error("Error al cargar el formulario. Verifique su conexión.");
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
          {formSchema.name || formSchema.title}
        </h1>
        {userName && (
          <p className="text-gray-600 mt-1">
            Usuario: <span className="font-semibold">{userName}</span>
            {userDocument ? ` - Identificacion: ${userDocument}` : ""}
          </p>
        )}
      </div>

      <div className="w-full">
        <FormRender
          formSchema={formSchema}
          initialAnswers={initialAnswers}
          onSubmit={handleSave}
          onCancel={() => navigate("/menu")}
        />
      </div>
    </div>
  );
};

export default FormRenderer;
