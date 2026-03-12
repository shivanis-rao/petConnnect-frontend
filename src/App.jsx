import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShelterBasePage from "./pages/ShelterBasePage.jsx";
import NgoRegistration from "./pages/NgoRegistration.jsx";
import WaitingPage from "./pages/WaitingPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shelter-register" element={<ShelterBasePage />} />
        <Route path="/shelter/ngo-register" element={<NgoRegistration />} />
        <Route path="/shelter/waiting-area" element={<WaitingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
