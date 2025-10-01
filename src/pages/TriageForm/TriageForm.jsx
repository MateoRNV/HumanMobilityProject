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
        // Usa UNA de las dos líneas de abajo según tu FormRender:
        initialAnswers={initialAnswers} // ✅ si tu FormRender soporta answers[]
        // defaultValues={defaultValues}   // ✅ si tu FormRender espera objeto plano

        onSubmit={(payload) => {
          // payload típico: { answers: [...], version?, submitted_at? }
          console.log("submit triage", { userId: user.id, payload });

          // aquí podrías simular guardar en tu store/mock
          // ej: updateUsers(user.id, { triage: payload })

          navigate(-1); // vuelve al listado o a donde prefieras
        }}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default TriageForm;

// --- Helpers opcionales ---

// Convierte answers[] a objeto plano por fieldId.
// Manejo simple para types comunes; ajusta según tu FormRender.
function answersToDefaults(answers = []) {
  const acc = {};
  for (const a of answers) {
    const { fieldId, type } = a;

    if (type === "matrix") {
      // Puedes guardar tal cual o re-mapear a una estructura que tu FormRender entienda
      // Ejemplo simple: un array de pares {row,column}
      acc[fieldId] = a.selections ?? [];
      if (a.observations) acc[`${fieldId}__observations`] = a.observations;
      continue;
    }

    if (type === "checkbox") {
      acc[fieldId] = !!a.value;
      if (a.extraValue) acc[`${fieldId}__extra`] = a.extraValue;
      continue;
    }

    // text | textarea | number | date | select | multi-select
    acc[fieldId] = a.value ?? null;
    if (a.extraValue) acc[`${fieldId}__extra`] = a.extraValue;
  }
  return acc;
}
