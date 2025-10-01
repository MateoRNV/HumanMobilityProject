import React, { useState } from "react";
import { FormRender } from "../../components/FormRender";
import triageSchema from "../../schema/triage.json";


export const TriageForm = () => {
  return (
    <div className="mt-3">
      <FormRender formSchema={triageSchema} />
    </div>
  );
};

export default TriageForm;
