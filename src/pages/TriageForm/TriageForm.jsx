import React from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { FormRender } from "../../components/FormRender";
import triageSchema from "../../schema/triage.json";
// Fallback si entras por URL directa sin state:
import { users } from "../../apis/users-api";

export const TriageForm = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1) Preferimos el user que viene por state desde la lista
  const userFromState = location.state?.user;
  const user = userFromState ?? users.find((u) => u.id === Number(userId));

  if (!user) {
    return (
      <div className="p-4">
        <p>No se encontró el usuario.</p>
        <button className="btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  // 2) Prefill: usamos el formato answers[] que ya generaste
  const initialAnswers = user.triage?.answers ?? [];

  // Si tu FormRender prefiere un objeto plano { [fieldId]: value },
  // descomenta esto y pásalo como defaultValues:
  // const defaultValues = answersToDefaults(initialAnswers);


  return (
    <div className="mt-3">
      <h1 className="text-xl font-semibold mb-4">
        Triaje — {user.name} ({user.document})
      </h1>

      <FormRender
        formSchema={triageSchema}
        initialAnswers={initialAnswers}
      />
    </div>
  );
};

export default TriageForm;
