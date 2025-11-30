import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Aeronaves from "./pages/Aeronaves/Aeronaves";
import Pecas from "./pages/Pecas/Pecas";
import Etapas from "./pages/Etapas/Etapas";
import Testes from "./pages/Testes/Testes";
import Funcionarios from "./pages/Funcionarios/Funcionarios"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aeronaves" element={<Aeronaves />} />
        <Route path="/pecas" element={<Pecas />} />
        <Route path="/etapas" element={<Etapas />} />
        <Route path="/testes" element={<Testes />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
