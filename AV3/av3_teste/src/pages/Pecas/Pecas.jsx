import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X, Edit3 } from "lucide-react";
import "./Pecas.css";

function Pecas() {
  const role = localStorage.getItem("userRole");
  const [pecas, setPecas] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [pecaEditando, setPecaEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [novaPeca, setNovaPeca] = useState({
    nomePeca: "",
    tipoPecaID: "",
    fornecedor: "",
    statusPecaID: "Em Produção",
    aeronaveID: "",
  });

  const fluxoStatus = {
    "Em Produção": ["Em Transporte"],
    "Em Transporte": ["Pronta"],
    "Pronta": []
  };

  const isTransicaoValida = (statusAtual, novoStatus) => {
    if (statusAtual === novoStatus) return true;
    
    return fluxoStatus[statusAtual]?.includes(novoStatus) || false;
  };

  const carregarPecas = async () => {
    try {
      setCarregando(true);
      const response = await fetch("http://localhost:3000/api/pecas");
      if (!response.ok) throw new Error("Erro ao carregar peças");
      const data = await response.json();
      setPecas(data);
    } catch (err) {
      console.error("Erro ao carregar peças:", err);
      alert("Erro ao carregar peças");
    } finally {
      setCarregando(false);
    }
  };

  const carregarAeronaves = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/aeronaves");
      if (!response.ok) throw new Error("Erro ao carregar aeronaves");
      const data = await response.json();
      setAeronaves(data);
    } catch (err) {
      console.error("Erro ao carregar aeronaves:", err);
    }
  };

  useEffect(() => {
    carregarPecas();
    carregarAeronaves();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaPeca({ 
      ...novaPeca, 
      [name]: value 
    });
  };

  const toggleModalCadastro = () => {
    setMostrarModalCadastro(!mostrarModalCadastro);
    if (!mostrarModalCadastro) {
      setNovaPeca({
        nomePeca: "",
        tipoPecaID: "",
        fornecedor: "",
        statusPecaID: "Em Produção",
        aeronaveID: "",
      });
    }
  };

  const handleSalvar = async () => {
    if (!novaPeca.nomePeca || !novaPeca.tipoPecaID || !novaPeca.fornecedor) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/pecas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...novaPeca,
          aeronaveID: novaPeca.aeronaveID || null
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao cadastrar peça");
      }

      const novaSalva = await response.json();
      
      setPecas([...pecas, novaSalva]);
      toggleModalCadastro();
      alert("Peça cadastrada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar peça:", err);
      alert(err.message);
    }
  };

  const excluirPeca = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta peça?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/pecas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao excluir peça");
      }

      setPecas(pecas.filter((p) => p.id_peca !== id));
      setMostrarModalEdicao(false);
      alert("Peça excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir peça:", err);
      alert(err.message);
    }
  };

  const abrirModalEdicao = (peca) => {
    setPecaEditando(peca);
    setNovaPeca({
      nomePeca: peca.nomePeca,
      tipoPecaID: peca.tipoPecaID,
      fornecedor: peca.fornecedor,
      statusPecaID: peca.statusPecaID,
      aeronaveID: peca.aeronaveID ? peca.aeronaveID.toString() : ""
    });
    setMostrarModalEdicao(true);
  };

  const salvarEdicao = async () => {
    if (!novaPeca.nomePeca || !novaPeca.tipoPecaID || !novaPeca.fornecedor || !novaPeca.statusPecaID) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (!isTransicaoValida(pecaEditando.statusPecaID, novaPeca.statusPecaID)) {
      const statusValidos = fluxoStatus[pecaEditando.statusPecaID];
      if (statusValidos.length > 0) {
        alert(`Transição de status inválida! \nDe "${pecaEditando.statusPecaID}" você só pode mudar para: ${statusValidos.join(", ")}`);
      } else {
        alert(`A peça já está com status "${pecaEditando.statusPecaID}" e não pode mais ser alterada.`);
      }
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/pecas/${pecaEditando.id_peca}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...novaPeca,
            aeronaveID: novaPeca.aeronaveID || null
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao atualizar peça");
      }

      const atualizada = await response.json();
      setPecas(pecas.map((p) => (p.id_peca === atualizada.id_peca ? atualizada : p)));
      
      setMostrarModalEdicao(false);
      setPecaEditando(null);
      alert("Peça atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar peça:", err);
      alert(err.message);
    }
  };

  const getOpcoesStatus = (statusAtual) => {
    const opcoes = [statusAtual]; 
    const proximosStatus = fluxoStatus[statusAtual] || [];
    
    return [...opcoes, ...proximosStatus];
  };

  const obterNomeAeronave = (aeronaveID) => {
    if (!aeronaveID) return "—";
    const aeronave = aeronaves.find(a => a.codigo === aeronaveID);
    return aeronave ? `${aeronave.modelo} (${aeronave.tipoAeronaveID})` : "—";
  };

  const getCorStatus = (status) => {
    switch (status) {
      case "Em Produção": return "#ffa500"; 
      case "Em Transporte": return "#007bff"; 
      case "Pronta": return "#28a745"; 
      default: return "#6c757d";
    }
  };

  const pecasFiltradas = pecas.filter((p) =>
    p.nomePeca.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="pecas">
      <aside className="menu-lateral">
        <h1>AEROCODE</h1>
        <ul>
          <li><Link to="/Dashboard">Home</Link></li>
          <li><Link to="/Aeronaves">Aeronaves</Link></li>
          <li><Link to="/Pecas" className="ativo">Peças</Link></li>
          <li><Link to="/Etapas">Etapas</Link></li>
          <li><Link to="/Testes">Testes</Link></li>
          {role?.toLowerCase() === "administrador" && (
            <li><Link to="/funcionarios">Funcionários</Link></li>
          )}
          <li><Link to="/">Sair</Link></li>
        </ul>
      </aside>

      <main className="conteudo">
        <header className="cabecalho">
          <h2>Gerenciamento de Peças</h2>
          <div className="legenda-status">
            <small>
              <strong>Fluxo de Status:</strong> Em Produção → Em Transporte → Pronta
            </small>
          </div>
        </header>

        <div className="busca-container">
          <Search className="icone-busca" />
          <input
            type="text"
            placeholder="Procurar Peça"
            className="input-busca"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="carregando">Carregando peças...</div>
        ) : (
          <table className="tabela-pecas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Fornecedor</th>
                <th>Status</th>
                <th>Aeronave</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pecasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="vazio">Nenhuma peça encontrada</td>
                </tr>
              ) : (
                pecasFiltradas.map((p) => (
                  <tr key={p.id_peca}>
                    <td>{p.nomePeca}</td>
                    <td>{p.tipoPecaID}</td>
                    <td>{p.fornecedor}</td>
                    <td>
                      <span 
                        className="badge-status"
                      >
                        {p.statusPecaID}
                      </span>
                    </td>
                    <td>{obterNomeAeronave(p.aeronaveID)}</td>
                    <td>
                      {role !== "Operador" && role !== "Engenheiro" && p.statusPecaID !== "Pronta" && (
                        <button
                          className="btn-editar"
                          onClick={() => abrirModalEdicao(p)}
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                      {p.statusPecaID === "Pronta" && (
                        <span className="bloqueado-texto">Finalizada</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {role !== "Operador" && role !== "Engenheiro" && (
          <button className="btn-flutuante" onClick={toggleModalCadastro}>
            <Plus size={22} />
          </button>
        )}

        {mostrarModalCadastro && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="fechar-modal" onClick={toggleModalCadastro}>
                <X size={20} />
              </button>
              <h3>Cadastrar Peça</h3>

              <input
                name="nomePeca"
                value={novaPeca.nomePeca}
                onChange={handleChange}
                placeholder="Nome da Peça"
                required
              />

              <select
                name="tipoPecaID"
                value={novaPeca.tipoPecaID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o Tipo</option>
                <option value="Nacional">Nacional</option>
                <option value="Importada">Importada</option>
              </select>

              <input
                name="fornecedor"
                value={novaPeca.fornecedor}
                onChange={handleChange}
                placeholder="Fornecedor"
                required
              />

              <select
                name="statusPecaID"
                value={novaPeca.statusPecaID}
                onChange={handleChange}
                required
              >
                <option value="Em Produção">Em Produção</option>
              </select>

              <select
                name="aeronaveID"
                value={novaPeca.aeronaveID}
                onChange={handleChange}
              >
                <option value="">Selecione a Aeronave (Opcional)</option>
                {aeronaves.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.modelo} ({a.tipoAeronaveID})
                  </option>
                ))}
              </select>

              <button className="btn-salvar" onClick={handleSalvar}>
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* MODAL EDIÇÃO */}
        {mostrarModalEdicao && pecaEditando && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="fechar-modal"
                onClick={() => setMostrarModalEdicao(false)}
              >
                <X size={20} />
              </button>
              <h3>Editar Peça</h3>
              <div className="status-atual">
                <small>Status atual: <strong>{pecaEditando.statusPecaID}</strong></small>
              </div>

              <input
                name="nomePeca"
                value={novaPeca.nomePeca}
                onChange={handleChange}
                placeholder="Nome da Peça"
                required
              />

              <select
                name="tipoPecaID"
                value={novaPeca.tipoPecaID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o Tipo</option>
                <option value="Nacional">Nacional</option>
                <option value="Importada">Importada</option>
              </select>

              <input
                name="fornecedor"
                value={novaPeca.fornecedor}
                onChange={handleChange}
                placeholder="Fornecedor"
                required
              />

              <select
                name="statusPecaID"
                value={novaPeca.statusPecaID}
                onChange={handleChange}
                required
                disabled={pecaEditando.statusPecaID === "Pronta"}
              >
                <option value="">Selecione o Status</option>
                {getOpcoesStatus(pecaEditando.statusPecaID).map((status) => (
                  <option key={status} value={status}>
                    {status} {status === pecaEditando.statusPecaID && "(Atual)"}
                  </option>
                ))}
              </select>

              {pecaEditando.statusPecaID === "Pronta" && (
                <div className="alerta-bloqueio">
                  Esta peça está finalizada e não pode mais ser alterada.
                </div>
              )}

              <select
                name="aeronaveID"
                value={novaPeca.aeronaveID}
                onChange={handleChange}
                disabled={pecaEditando.statusPecaID === "Pronta"}
              >
                <option value="">Selecione a Aeronave (Opcional)</option>
                {aeronaves.map((a) => (
                  <option key={a.codigo} value={a.codigo}>
                    {a.modelo} ({a.tipoAeronaveID})
                  </option>
                ))}
              </select>

              <div className="botoes-acao">
                <button 
                  className="btn-salvar" 
                  onClick={salvarEdicao}
                  disabled={pecaEditando.statusPecaID === "Pronta"}
                >
                  {pecaEditando.statusPecaID === "Pronta" ? "Bloqueado" : "Salvar alterações"}
                </button>
                <button
                  className="btn-excluir"
                  onClick={() => excluirPeca(pecaEditando.id_peca)}
                  disabled={pecaEditando.statusPecaID === "Pronta"}
                >
                  {pecaEditando.statusPecaID === "Pronta" ? "Exclusão Bloqueada" : "Excluir Peça"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Pecas;