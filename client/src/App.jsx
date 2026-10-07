import { Route, Routes } from "react-router-dom";
import SurveyPage from "./pages/SurveyPage.jsx";
import ThankYouPage from "./pages/ThankYouPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SurveyPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}
