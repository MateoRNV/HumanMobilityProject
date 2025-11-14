import React from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { FormRender } from "../../components/FormRender";
import psicologicalSchema from "../../schema/psicological.json";
import { users } from "../../apis/users-api";

export const PsicologicalForm = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

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

  const initialAnswers = user.psychological?.answers ?? [];

  return (
    <div className="mt-3">
      <div
        onClick={() => navigate("/menu")}
        className="material-symbols-outlined absolute cursor-pointer "
        style={{ marginLeft: "10%" }}
      >
        arrow_back
      </div>
      <h1 className="text-xl font-semibold my-4 w-full text-center">
        Psicología — {user.name} ({user.document})
      </h1>

      <FormRender
        formSchema={psicologicalSchema}
        initialAnswers={initialAnswers}
      />
    </div>
  );
};

export default PsicologicalForm;
