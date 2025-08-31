import { Routes, Route } from "react-router";
import Home from "./pages/Home/Home";
import { TriageForm } from "./pages/TriageForm/TriageForm";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/triage" element={<TriageForm />} />
    </Routes>
  );
}
