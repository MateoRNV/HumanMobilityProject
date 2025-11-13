import React from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { FormRender } from "../../components/FormRender";
import socialWorkSchema from "../../schema/socialWork.json";
import { users } from "../../apis/users-api";

export const SocialWorkForm = () => {
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

  const initialAnswers = user.socialWork?.answers ?? [];

  return (
    <div className="mt-3">
      <h1 className="text-xl font-semibold my-4 w-full text-center">
        Trabajo Social — {user.name} ({user.document})
      </h1>

      <FormRender
        formSchema={socialWorkSchema}
        initialAnswers={initialAnswers}
      />
    </div>
  );
};

export default SocialWorkForm;