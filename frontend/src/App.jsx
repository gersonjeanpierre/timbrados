import { Routes, Route } from "react-router-dom";
import LinesPage from "./pages/LinesPage";
import { NotFound } from "./pages/NotFound";
import Navbar from "./components/Navbar";
import LinesUpdate from "./pages/LinesUpdate";
import LinesView from "./pages/LinesView";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LinesPage />} />
        <Route path="/linesup" element={<LinesUpdate />} />
        <Route path="/consulta" element={<LinesView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
