import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3 } from "lucide-react";
import "./Testes.css";

function Testes() {
  const role = localStorage.getItem("userRole");
  const [testes, setTestes] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
  const [testeSelecionado, setTesteSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [novoTeste, setNovoTeste] = useState({
    tipoTesteID: "",
    resultadoTesteID: "",
    aeronaveID: ""
  });

  const tiposTeste = ["Aerodinâmico", "Elétrico", "Hidráulico"];
  const resultadosTeste = ["Aprovado", "Reprovado"];

  const carregarTestes = async () => {
    try {
      setCarregando(true);
      const response = await fetch("http://localhost:3000/api/testes");
      if (!response.ok) throw new Error("Erro ao carregar testes");
      const data = await response.json();
      setTestes(data);
    } catch (err) {
      console.error("Erro ao carregar testes:", err);
      alert("Erro ao carregar testes");
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
    carregarTestes();
    carregarAeronaves();
  }, []);

  const testesFiltrados = filtro === "Todas" 
    ? testes 
    : testes.filter((teste) => teste.tipoTesteID === filtro);

  const toggleModalCadastro = () => {
    setMostrarModalCadastro(!mostrarModalCadastro);
    if (!mostrarModalCadastro) {
      setNovoTeste({
        tipoTesteID: "",
        resultadoTesteID: "",
        aeronaveID: ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoTeste({ ...novoTeste, [name]: value });
  };

  const handleSalvar = async () => {
    if (!novoTeste.tipoTesteID || !novoTeste.resultadoTesteID || !novoTeste.aeronaveID) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/testes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoTesteID: novoTeste.tipoTesteID,
          resultadoTesteID: novoTeste.resultadoTesteID,
          aeronaveID: Number(novoTeste.aeronaveID)
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao cadastrar teste");
      }

      const novoSALVO = await response.json();
      
      setTestes([...testes, novoSALVO]);
      toggleModalCadastro();
      alert("Teste cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar teste:", err);
      alert("Erro ao salvar teste. Verifique se os valores selecionados existem no banco de dados.");
    }
  };

  const excluirTeste = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este teste?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/testes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao excluir teste");
      }

      setTestes(testes.filter(t => t.id_teste !== id));
      setMostrarModalDetalhes(false);
      alert("Teste excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir teste:", err);
      alert(err.message);
    }
  };

  const abrirDetalhes = (teste) => {
    setTesteSelecionado({
      ...teste,
      aeronaveID: teste.aeronaveID.toString()
    });
    setMostrarModalDetalhes(true);
  };

  const handleChangeDetalhes = (e) => {
    const { name, value } = e.target;
    setTesteSelecionado({ ...testeSelecionado, [name]: value });
  };

  const handleAtualizar = async () => {
    if (!testeSelecionado.tipoTesteID || !testeSelecionado.resultadoTesteID || !testeSelecionado.aeronaveID) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/testes/${testeSelecionado.id_teste}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipoTesteID: testeSelecionado.tipoTesteID,
            resultadoTesteID: testeSelecionado.resultadoTesteID,
            aeronaveID: Number(testeSelecionado.aeronaveID)
          }),
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao atualizar teste");
      }

      const atualizado = await response.json();
      setTestes(testes.map(t => 
        t.id_teste === atualizado.id_teste ? atualizado : t
      ));
      
      setMostrarModalDetalhes(false);
      setTesteSelecionado(null);
      alert("Teste atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar teste:", err);
      alert(err.message);
    }
  };

  const getIconeTeste = (tipoTeste) => {
    const icones = {
      'Aerodinâmico': '🌬️',
      'Elétrico': '⚡',
      'Hidráulico': '💧'
    };
    return icones[tipoTeste] || '🛠️';
  };

  const getCorResultado = (resultado) => {
    return resultado === 'Aprovado' ? '#28a745' : 
           resultado === 'Reprovado' ? '#dc3545' : '#ffc107';
  };

  const obterNomeAeronave = (aeronaveID) => {
    if (!aeronaveID) return "—";
    const aeronave = aeronaves.find(a => a.codigo === aeronaveID);
    return aeronave ? `${aeronave.modelo} (${aeronave.tipoAeronaveID})` : "—";
  };

  return (
    <div className="testes">
      <aside className="menu-lateral">
        <h1>AEROCODE</h1>
        <ul>
          <li><Link to="/Dashboard">Home</Link></li>
          <li><Link to="/Aeronaves">Aeronaves</Link></li>
          <li><Link to="/Pecas">Peças</Link></li>
          <li><Link to="/Etapas">Etapas</Link></li>
          <li><Link to="/Testes" className="ativo">Testes</Link></li>
          {role === "Administrador" && (
            <li><Link to="/funcionarios">Funcionários</Link></li>
          )}
          <li><Link to="/">Sair</Link></li>
        </ul>
      </aside>

      <main className="conteudo">
        <header className="cabecalho">
          <h2>Gerenciamento de Testes</h2>
        </header>

        <div className="filtros">
          <button
            className={filtro === "Todas" ? "ativo" : ""}
            onClick={() => setFiltro("Todas")}
          >
            Todas
          </button>
          {tiposTeste.map((tipo, idx) => (
            <button
              key={idx}
              className={filtro === tipo ? "ativo" : ""}
              onClick={() => setFiltro(tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>

        {carregando ? (
          <div className="carregando">Carregando testes...</div>
        ) : (
          <div className="grid-testes">
            {testesFiltrados.length === 0 ? (
              <p className="nenhuma-etapa">Nenhum teste encontrado</p>
            ) : (
              testesFiltrados.map((teste) => (
                <div className="card-testes" key={teste.id_teste}>
                  <div className="icone">
                    {getIconeTeste(teste.tipoTesteID)}
                  </div>
                  <h4>{teste.tipoTesteID}</h4>
                  <p>
                    <strong>Resultado:</strong> 
                    <span 
                      style={{ color: getCorResultado(teste.resultadoTesteID), fontWeight: 'bold', marginLeft: '5px' }}
                    >
                      {teste.resultadoTesteID}
                    </span>
                  </p>
                  <p><strong>Aeronave:</strong> {obterNomeAeronave(teste.aeronaveID)}</p>
                  
                  {role !== "Operador" && (
                    <button
                      className="btn-editar"
                      onClick={() => abrirDetalhes(teste)}
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
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
              <h3>Cadastrar Teste</h3>
              
              <select
                name="tipoTesteID"
                value={novoTeste.tipoTesteID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o tipo de teste</option>
                {tiposTeste.map((tipo, idx) => (
                  <option key={idx} value={tipo}>{tipo}</option>
                ))}
              </select>

              <select
                name="resultadoTesteID"
                value={novoTeste.resultadoTesteID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o resultado</option>
                {resultadosTeste.map((resultado, idx) => (
                  <option key={idx} value={resultado}>{resultado}</option>
                ))}
              </select>

              <select
                name="aeronaveID"
                value={novoTeste.aeronaveID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione a Aeronave</option>
                {aeronaves.map((aeronave) => (
                  <option key={aeronave.codigo} value={aeronave.codigo}>
                    {aeronave.modelo} ({aeronave.tipoAeronaveID})
                  </option>
                ))}
              </select>

              <button className="btn-salvar" onClick={handleSalvar}>
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Modal Detalhes */}
        {mostrarModalDetalhes && testeSelecionado && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="fechar-modal"
                onClick={() => setMostrarModalDetalhes(false)}
              >
                ✖
              </button>
              <h3>Editar Teste</h3>
              
              <select
                name="tipoTesteID"
                value={testeSelecionado.tipoTesteID}
                onChange={handleChangeDetalhes}
                required
              >
                {tiposTeste.map((tipo, idx) => (
                  <option key={idx} value={tipo}>{tipo}</option>
                ))}
              </select>

              <select
                name="resultadoTesteID"
                value={testeSelecionado.resultadoTesteID}
                onChange={handleChangeDetalhes}
                required
              >
                {resultadosTeste.map((resultado, idx) => (
                  <option key={idx} value={resultado}>{resultado}</option>
                ))}
              </select>

              <select
                name="aeronaveID"
                value={testeSelecionado.aeronaveID}
                onChange={handleChangeDetalhes}
                required
              >
                <option value="">Selecione a Aeronave</option>
                {aeronaves.map((aeronave) => (
                  <option key={aeronave.codigo} value={aeronave.codigo}>
                    {aeronave.modelo} ({aeronave.tipoAeronaveID})
                  </option>
                ))}
              </select>

              <div className="botoes-acao">
                <button className="btn-salvar" onClick={handleAtualizar}>
                  Atualizar
                </button>
                <button 
                  className="btn-excluir" 
                  onClick={() => excluirTeste(testeSelecionado.id_teste)}
                >
                  Excluir Teste
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Testes;