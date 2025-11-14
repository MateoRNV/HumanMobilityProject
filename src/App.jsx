import { Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import { TriageForm } from "./pages/TriageForm/TriageForm";
import { SocialWorkForm } from "./pages/SocialWorkForm/SocialWorkForm";
import { LegalForm } from "./pages/LegalForm/LegalForm";
import { Menu } from "./pages/Menu/Menu";
import "./App.css";

// Layout con banner
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
      {/* Ruta SIN banner */}
      <Route path="/" element={<Home />} />

      {/* Rutas CON banner */}
      <Route
        path="/menu"
        element={
          <LayoutWithBanner>
            <Menu />
          </LayoutWithBanner>
        }
      />
      <Route
        path="/triaje/:userId"
        element={
          <LayoutWithBanner>
            <TriageForm />
          </LayoutWithBanner>
        }
      />
      <Route
        path="/trabajo-social/:userId"
        element={
          <LayoutWithBanner>
            <SocialWorkForm />
          </LayoutWithBanner>
        }
      />
      <Route
        path="/legal/:userId"
        element={
          <LayoutWithBanner>
            <LegalForm />
          </LayoutWithBanner>
        }
      />
    </Routes>
  );
}
