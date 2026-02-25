import { Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import FormRenderer from "./pages/FormRenderer/FormRenderer";
import QuestionnaireEditor from "./pages/Menu/components/QuestionnaireEditor";
import "./App.css";

function LayoutWithBanner({ children }) {
  return (
    <div>
      <div className="banner">Banner</div>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/menu"
        element={
          <LayoutWithBanner>
            <Menu />
          </LayoutWithBanner>
        }
      />
      <Route
        path="/formulario/:slug/:personaId"
        element={
          <LayoutWithBanner>
            <FormRenderer />
          </LayoutWithBanner>
        }
      />
      <Route path="/editor/:slug" element={<QuestionnaireEditor />} />
    </Routes>
  );
}
