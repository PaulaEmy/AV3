import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X, Edit3, FileText } from "lucide-react";
import "./Aeronaves.css";

function Aeronaves() {
  const role = localStorage.getItem("userRole");

  const [aeronaves, setAeronaves] = useState([]);
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [busca, setBusca] = useState("");
  const [aeronaveEditando, setAeronaveEditando] = useState(null);

  const [novaAeronave, setNovaAeronave] = useState({
    modelo: "",
    tipoAeronaveID: "",
    capacidade: "",
    alcance: "",
    cliente: ""
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/aeronaves")
      .then((res) => res.json())
      .then((data) => setAeronaves(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleModalCadastro = () => setMostrarModalCadastro(!mostrarModalCadastro);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaAeronave({ ...novaAeronave, [name]: value });
  };

  const handleSalvar = () => {
    const { modelo, tipoAeronaveID, capacidade, alcance, cliente } = novaAeronave;

    if (!modelo || !tipoAeronaveID || !capacidade || !alcance || !cliente) {
      alert("Preencha todos os campos!");
      return;
    }

    fetch("http://localhost:3000/api/aeronaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelo,
        tipoAeronaveID,
        capacidade: Number(capacidade),
        alcance: Number(alcance),
        cliente
      })
    })
      .then((res) => res.json())
      .then(() => window.location.reload());
  };

  const abrirModalEdicao = (index) => {
    setAeronaveEditando(aeronaves[index]);
    setNovaAeronave(aeronaves[index]);
    setMostrarModalEdicao(true);
  };

  const salvarEdicao = () => {
    fetch(`http://localhost:3000/api/aeronaves/${aeronaveEditando.codigo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelo: novaAeronave.modelo,
        tipoAeronaveID: novaAeronave.tipoAeronaveID,
        capacidade: Number(novaAeronave.capacidade),
        alcance: Number(novaAeronave.alcance),
        cliente: novaAeronave.cliente
      })
    })
      .then((res) => res.json())
      .then(() => window.location.reload());
  };

  const excluirAeronave = () => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;

    fetch(`http://localhost:3000/api/aeronaves/${aeronaveEditando.codigo}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => window.location.reload());
  };

  // FUNÇÃO PARA GERAR RELATÓRIO
const gerarRelatorio = async (aeronave) => {
  try {
    console.log("Gerando relatório para aeronave:", aeronave.modelo, "Código:", aeronave.codigo);

    const [pecasRes, testesRes] = await Promise.all([
      fetch("http://localhost:3000/api/pecas").then(res => res.json()),
      fetch("http://localhost:3000/api/testes").then(res => res.json())
    ]);

    console.log("Peças da API:", pecasRes);
    console.log("Testes da API:", testesRes);

    const pecasDaAeronave = pecasRes.filter(peca => {
      console.log("Peça - aeronaveID:", peca.aeronaveID, "Aeronave código:", aeronave.codigo);
      return peca.aeronaveID === aeronave.codigo;
    });

    const testesDaAeronave = testesRes.filter(teste => {
      console.log("Teste - aeronaveID:", teste.aeronaveID, "Aeronave código:", aeronave.codigo);
      return teste.aeronaveID === aeronave.codigo;
    });

    console.log("Peças filtradas:", pecasDaAeronave);
    console.log("Testes filtrados:", testesDaAeronave);

    const relatorio = `
=== Relatório da Aeronave ===
Modelo: ${aeronave.modelo}
Tipo: ${aeronave.tipoAeronaveID}
Capacidade: ${aeronave.capacidade}
Alcance: ${aeronave.alcance}
Cliente: ${aeronave.cliente}

--- Peças (${pecasDaAeronave.length}) ---
${pecasDaAeronave.length > 0
  ? pecasDaAeronave.map((p, i) => 
      `${i + 1}. ${p.nomePeca} | Tipo: ${p.tipoPecaID} | Fornecedor: ${p.fornecedor} | Status: ${p.statusPecaID}`
    ).join("\n")
  : "- Nenhuma peça cadastrada"
}

--- Testes (${testesDaAeronave.length}) ---
${testesDaAeronave.length > 0
  ? testesDaAeronave.map((t, i) => 
      `${i + 1}. ${t.tipoTesteID} | Resultado: ${t.resultadoTesteID}`
    ).join("\n")
  : "- Nenhum teste cadastrado"
}

Relatório gerado em: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([relatorio], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_${aeronave.modelo.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    alert("Erro ao gerar relatório. Tente novamente.");
  }
};

  const formatarData = (dataISO) => {
    if (!dataISO) return "Não definido";
    try {
      const [ano, mes, dia] = dataISO.split("-");
      return `${dia}/${mes}/${ano}`;
    } catch {
      return dataISO;
    }
  };

  const aeronavesFiltradas = aeronaves.filter(
    (a) =>
      a.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      a.tipoAeronaveID.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="aeronave">
      <aside className="menu-lateral">
        <h1>AEROCODE</h1>
        <ul>
          <li><Link to="/Dashboard">Home</Link></li>
          <li><Link to="/Aeronaves" className="ativo">Aeronaves</Link></li>
          <li><Link to="/Pecas">Peças</Link></li>
          <li><Link to="/Etapas">Etapas</Link></li>
          <li><Link to="/Testes">Testes</Link></li>
          {role === "Administrador" && (
            <li><Link to="/funcionarios">Funcionários</Link></li>
          )}
          <li><Link to="/">Sair</Link></li>
        </ul>
      </aside>

      <main className="conteudo">
        <header className="cabecalho">
          <h2>Gerenciamento de Aeronaves</h2>
        </header>

        <div className="busca-container">
          <Search className="icone-busca" />
          <input
            type="text"
            placeholder="Procurar Aeronave"
            className="input-busca"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="tabela-aeronaves">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Tipo</th>
              <th>Capacidade</th>
              <th>Alcance</th>
              <th>Cliente</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {aeronavesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="vazio">Nenhuma aeronave encontrada</td>
              </tr>
            ) : (
              aeronavesFiltradas.map((a, index) => (
                <tr key={index}>
                  <td>{a.modelo}</td>
                  <td>{a.tipoAeronaveID}</td>
                  <td>{a.capacidade}</td>
                  <td>{a.alcance}</td>
                  <td>{a.cliente}</td>

                  <td>
                    <div className="acoes-container">
                      <button 
                        className="btn-relatorio" 
                        onClick={() => gerarRelatorio(a)}
                        title="Gerar Relatório"
                      >
                        <FileText size={16} />
                        Relatório
                      </button>
                      
                      {role !== "Operador" && (
                        <button 
                          className="btn-editar" 
                          onClick={() => abrirModalEdicao(index)}
                          title="Editar Aeronave"
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {role !== "Operador" && (
          <button className="btn-flutuante" onClick={toggleModalCadastro}>
            <Plus size={22} />
          </button>
        )}

        {/* ======================== MODAL CADASTRO ======================== */}

        {mostrarModalCadastro && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="fechar-modal" onClick={toggleModalCadastro}>
                <X size={20} />
              </button>
              <h3>Cadastrar Aeronave</h3>

              <input name="modelo" value={novaAeronave.modelo} onChange={handleChange} placeholder="Modelo" />

              <select name="tipoAeronaveID" value={novaAeronave.tipoAeronaveID} onChange={handleChange}>
                <option value="">Selecione o tipo</option>
                <option value="Militar">Militar</option>
                <option value="Comercial">Comercial</option>
              </select>

              <input name="capacidade" value={novaAeronave.capacidade} onChange={handleChange} placeholder="Capacidade" />

              <input name="alcance" value={novaAeronave.alcance} onChange={handleChange} placeholder="Alcance" />

              <input name="cliente" value={novaAeronave.cliente} onChange={handleChange} placeholder="Cliente" />

              <button className="btn-salvar" onClick={handleSalvar}>Salvar</button>
            </div>
          </div>
        )}

        {/* ======================== MODAL EDIÇÃO ======================== */}

        {mostrarModalEdicao && (
          <div className="modal-overlay">
            <div className="modal">

              <button className="fechar-modal" onClick={() => setMostrarModalEdicao(false)}>
                <X size={20} />
              </button>

              <h3>Editar Aeronave</h3>

              <input name="modelo" value={novaAeronave.modelo} onChange={handleChange} />

              <select name="tipoAeronaveID" value={novaAeronave.tipoAeronaveID} onChange={handleChange}>
                <option value="">Selecione o tipo</option>
                <option value="Militar">Militar</option>
                <option value="Comercial">Comercial</option>
              </select>

              <input name="capacidade" value={novaAeronave.capacidade} onChange={handleChange} />

              <input name="alcance" value={novaAeronave.alcance} onChange={handleChange} />

              <input name="cliente" value={novaAeronave.cliente} onChange={handleChange} />

              <button className="btn-salvar" onClick={salvarEdicao}>Salvar alterações</button>

              <button className="btn-excluir" onClick={excluirAeronave}>Excluir Aeronave</button>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Aeronaves;