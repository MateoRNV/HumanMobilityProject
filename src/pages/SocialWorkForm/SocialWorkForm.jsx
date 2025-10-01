import { FormRender } from "../../components/FormRender";
import socialWorkSchema from "../../schema/socialWork.json";


export const SocialWorkForm = () => {
  return (
    <div className="mt-3">
      <FormRender formSchema={socialWorkSchema} />
    </div>
  );
};
