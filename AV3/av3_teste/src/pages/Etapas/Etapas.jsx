import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3 } from "lucide-react";
import "./Etapas.css";

function Etapas() {
  const role = localStorage.getItem("userRole");
  const usuarioLogado = localStorage.getItem("userEmail") || "Desconhecido";

  const [etapas, setEtapas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
  const [etapaSelecionada, setEtapaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [novaEtapa, setNovaEtapa] = useState({
    prazo: "",
    statusEtapaID: "Pendente"
  });

  const [novoFuncionarioId, setNovoFuncionarioId] = useState("");

  const filtros = ["Todas", "Pendente", "Andamento", "Concluída"];

  const carregarEtapas = async () => {
    try {
      setCarregando(true);
      const response = await fetch("http://localhost:3000/api/etapas");
      if (!response.ok) throw new Error("Erro ao carregar etapas");
      const data = await response.json();
      setEtapas(data);
    } catch (err) {
      console.error("Erro ao carregar etapas:", err);
      alert("Erro ao carregar etapas");
    } finally {
      setCarregando(false);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      console.log("🔄 Buscando funcionários...");
      const response = await fetch("http://localhost:3000/api/funcionarios");
      
      console.log("📊 Status da resposta:", response.status);
      console.log("✅ Resposta OK?", response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na resposta:", errorText);
        throw new Error("Erro ao carregar funcionários");
      }
      
      const data = await response.json();
      console.log("👥 Funcionários carregados:", data);
      console.log("📝 Estrutura do primeiro funcionário:", data[0]);
      
      setFuncionarios(data);
    } catch (err) {
      console.error("💥 Erro ao carregar funcionários:", err);
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
    carregarEtapas();
    carregarFuncionarios();
    carregarAeronaves();
  }, []);

  const etapasFiltradas = filtro === "Todas" 
    ? etapas 
    : etapas.filter((etapa) => etapa.statusEtapaID === filtro);

  const toggleModalCadastro = () => {
    setMostrarModalCadastro(!mostrarModalCadastro);
    if (!mostrarModalCadastro) {
      setNovaEtapa({
        prazo: "",
        statusEtapaID: "Pendente"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaEtapa({ ...novaEtapa, [name]: value });
  };

  const handleSalvar = async () => {
    if (!novaEtapa.prazo) {
      alert("Preencha a data de prazo!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/etapas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaEtapa),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao cadastrar etapa");
      }

      const novaSalva = await response.json();
      
      setEtapas([...etapas, novaSalva]);
      toggleModalCadastro();
      alert("Etapa cadastrada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar etapa:", err);
      alert(err.message);
    }
  };

  const excluirEtapa = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta etapa?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/etapas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao excluir etapa");
      }

      setEtapas(etapas.filter(e => e.id_etapa !== id));
      setMostrarModalDetalhes(false);
      alert("Etapa excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir etapa:", err);
      alert(err.message);
    }
  };

  const abrirDetalhes = (etapa) => {
    setEtapaSelecionada(etapa);
    setNovoFuncionarioId("");
    setMostrarModalDetalhes(true);
  };

  const handleChangeDetalhes = (e) => {
    const { name, value } = e.target;
    setEtapaSelecionada({ ...etapaSelecionada, [name]: value });
  };

  const handleAtualizar = async () => {
    if (!etapaSelecionada.prazo || !etapaSelecionada.statusEtapaID) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/etapas/${etapaSelecionada.id_etapa}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prazo: etapaSelecionada.prazo,
            statusEtapaID: etapaSelecionada.statusEtapaID
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao atualizar etapa");
      }

      const atualizada = await response.json();
      setEtapas(etapas.map(e => 
        e.id_etapa === atualizada.id_etapa ? atualizada : e
      ));
      
      setMostrarModalDetalhes(false);
      setEtapaSelecionada(null);
      alert("Etapa atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar etapa:", err);
      alert(err.message);
    }
  };

  const adicionarFuncionario = async () => {
    if (!novoFuncionarioId) {
      alert("Selecione um funcionário!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/etapas/${etapaSelecionada.id_etapa}/funcionarios/${novoFuncionarioId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao adicionar funcionário");
      }

      const etapaAtualizada = await response.json();
      setEtapaSelecionada(etapaAtualizada);
      setNovoFuncionarioId("");
      alert("Funcionário adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar funcionário:", err);
      alert(err.message);
    }
  };

  const removerFuncionario = async (funcionarioId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/etapas/${etapaSelecionada.id_etapa}/funcionarios/${funcionarioId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao remover funcionário");
      }

      const etapaAtualizada = await response.json();
      setEtapaSelecionada(etapaAtualizada);
      alert("Funcionário removido com sucesso!");
    } catch (err) {
      console.error("Erro ao remover funcionário:", err);
      alert(err.message);
    }
  };

  const iniciarEtapa = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/etapas/${id}/iniciar`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao iniciar etapa");
      }

      const etapaAtualizada = await response.json();
      setEtapas(etapas.map(e => 
        e.id_etapa === etapaAtualizada.id_etapa ? etapaAtualizada : e
      ));
      
      if (etapaSelecionada && etapaSelecionada.id_etapa === id) {
        setEtapaSelecionada(etapaAtualizada);
      }
      
      alert("Etapa iniciada com sucesso!");
    } catch (err) {
      console.error("Erro ao iniciar etapa:", err);
      alert(err.message);
    }
  };

  const concluirEtapa = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/etapas/${id}/concluir`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao concluir etapa");
      }

      const etapaAtualizada = await response.json();
      setEtapas(etapas.map(e => 
        e.id_etapa === etapaAtualizada.id_etapa ? etapaAtualizada : e
      ));
      
      if (etapaSelecionada && etapaSelecionada.id_etapa === id) {
        setEtapaSelecionada(etapaAtualizada);
      }
      
      alert("Etapa concluída com sucesso!");
    } catch (err) {
      console.error("Erro ao concluir etapa:", err);
      alert(err.message);
    }
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const getCorStatus = (status) => {
    switch (status) {
      case 'Pendente': return '#ffa500';
      case 'Andamento': return '#007bff';
      case 'Concluída': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="etapas-page">
      <aside className="menu-lateral">
        <h1>AEROCODE</h1>
        <ul>
          <li><Link to="/Dashboard">Home</Link></li>
          <li><Link to="/Aeronaves">Aeronaves</Link></li>
          <li><Link to="/Pecas">Peças</Link></li>
          <li><Link to="/Etapas" className="ativo">Etapas</Link></li>
          <li><Link to="/Testes">Testes</Link></li>
          {role === "Administrador" && (
            <li><Link to="/funcionarios">Funcionários</Link></li>
          )}
          <li><Link to="/">Sair</Link></li>
        </ul>
      </aside>

      <main className="conteudo">
        <header className="cabecalho">
          <h2>Gerenciamento de Etapas</h2>
        </header>

        <div className="filtros">
          {filtros.map((f, idx) => (
            <button
              key={idx}
              className={filtro === f ? "ativo" : ""}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {carregando ? (
          <div className="carregando">Carregando etapas...</div>
        ) : (
          <div className="grid-etapas">
            {etapasFiltradas.length === 0 ? (
              <p className="nenhuma-etapa">Nenhuma etapa encontrada</p>
            ) : (
              etapasFiltradas.map((etapa) => (
                <div className="card-etapa" key={etapa.id_etapa}>
                  <div className="icone">🛠️</div>
                  <h4>Etapa #{etapa.id_etapa}</h4>
                  <p><strong>Prazo:</strong> {formatarData(etapa.prazo)}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span style={{ 
                      color: getCorStatus(etapa.statusEtapaID), 
                      fontWeight: 'bold', 
                      marginLeft: '5px' 
                    }}>
                      {etapa.statusEtapaID}
                    </span>
                  </p>
                  <p><strong>Funcionários:</strong> {etapa.funcionarios?.length || 0}</p>
                  
                  <div className="acoes-etapa">
                    {etapa.statusEtapaID === "Pendente" && role !== "Operador" && (
                      <button 
                        className="btn-iniciar"
                        onClick={() => iniciarEtapa(etapa.id_etapa)}
                      >
                        Iniciar
                      </button>
                    )}
                    {etapa.statusEtapaID === "Andamento" && role !== "Operador" && (
                      <button 
                        className="btn-concluir"
                        onClick={() => concluirEtapa(etapa.id_etapa)}
                      >
                        Concluir
                      </button>
                    )}
                    {role !== "Operador" && (
                      <button
                        className="btn-editar"
                        onClick={() => abrirDetalhes(etapa)}
                      >
                        <Edit3 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {role !== "Operador" && (
          <button className="btn-flutuante" onClick={toggleModalCadastro}>
            <Plus size={22} />
          </button>
        )}

        {/* Modal Cadastro */}
        {mostrarModalCadastro && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="fechar-modal" onClick={toggleModalCadastro}>
                ✖
              </button>
              <h3>Cadastrar Etapa</h3>
              
              <input
                type="date"
                name="prazo"
                value={novaEtapa.prazo}
                onChange={handleChange}
                required
              />
              
              <select
                name="statusEtapaID"
                value={novaEtapa.statusEtapaID}
                onChange={handleChange}
                required
              >
                <option value="Pendente">Pendente</option>
                <option value="Andamento">Em andamento</option>
                <option value="Concluída">Concluída</option>
              </select>

              <button className="btn-salvar" onClick={handleSalvar}>
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Modal Detalhes */}
        {mostrarModalDetalhes && etapaSelecionada && (
          <div className="modal-overlay">
            <div className="modal modal-grande">
              <button
                className="fechar-modal"
                onClick={() => setMostrarModalDetalhes(false)}
              >
                ✖
              </button>
              <h3>Detalhes da Etapa #{etapaSelecionada.id_etapa}</h3>
              
              <div className="campo">
                <label>Prazo:</label>
                <input
                  type="date"
                  name="prazo"
                  value={etapaSelecionada.prazo}
                  onChange={handleChangeDetalhes}
                  required
                />
              </div>

              <div className="campo">
                <label>Status:</label>
                <select
                  name="statusEtapaID"
                  value={etapaSelecionada.statusEtapaID}
                  onChange={handleChangeDetalhes}
                  required
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>

              <div className="campo">
                <h4>Funcionários Participantes</h4>
                {etapaSelecionada.funcionarios?.length > 0 ? (
                  <ul className="lista-funcionarios">
                    {etapaSelecionada.funcionarios.map((funcionario) => (
                      <li key={funcionario.funcionario_id}>
                        <span>{funcionario.nome} ({funcionario.nivelPermissaoID})</span>
                        <button 
                          onClick={() => removerFuncionario(funcionario.funcionario_id)}
                          className="btn-remover"
                        >
                          ❌
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum funcionário associado</p>
                )}
                
                <div className="adicionar-funcionario">
                  <select
                    value={novoFuncionarioId}
                    onChange={(e) => setNovoFuncionarioId(e.target.value)}
                  >
                    <option value="">Selecione um funcionário</option>
                    
                    {funcionarios.length > 0 ? (
                      funcionarios.map((func) => (
                        <option key={func.funcionario_id} value={func.funcionario_id}>
                          {func.nome} - {func.nivelPermissaoID} (ID: {func.funcionario_id})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>❌ NENHUM FUNCIONÁRIO CARREGADO</option>
                    )}
                  </select>
                  
                  <button className="btn-adicionar" onClick={adicionarFuncionario}>
                    Adicionar
                  </button>
                  
                </div>
              </div>

              <div className="botoes-acao">
                <button className="btn-salvar" onClick={handleAtualizar}>
                  Atualizar
                </button>
                <button 
                  className="btn-excluir" 
                  onClick={() => excluirEtapa(etapaSelecionada.id_etapa)}
                >
                  Excluir Etapa
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Etapas;