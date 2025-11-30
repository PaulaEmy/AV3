import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, X, Edit3 } from "lucide-react";
import "./Funcionarios.css";

function Funcionarios() {
  const role = localStorage.getItem('userRole');
  const [funcionarios, setFuncionarios] = useState([]);
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    usuario: "",
    senha: "",
    nivelPermissaoID: ""
  });

  const carregarFuncionarios = async () => {
    try {
      setCarregando(true);
      const response = await fetch("http://localhost:3000/api/funcionarios");
      if (!response.ok) throw new Error("Erro ao carregar funcionários");
      const data = await response.json();
      setFuncionarios(data);
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
      alert("Erro ao carregar funcionários");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const toggleModalCadastro = () => {
    setMostrarModalCadastro(!mostrarModalCadastro);
    if (!mostrarModalCadastro) {
      setNovoFuncionario({
        nome: "",
        telefone: "",
        endereco: "",
        usuario: "",
        senha: "",
        nivelPermissaoID: ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoFuncionario({ ...novoFuncionario, [name]: value });
  };

  const handleSalvar = async () => {
    if (
      !novoFuncionario.nome ||
      !novoFuncionario.telefone ||
      !novoFuncionario.endereco ||
      !novoFuncionario.usuario ||
      !novoFuncionario.senha ||
      !novoFuncionario.nivelPermissaoID
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/funcionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoFuncionario),
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao cadastrar funcionário");
      }

      const novoSALVO = await response.json();
      
      setFuncionarios([...funcionarios, novoSALVO]);
      toggleModalCadastro();
      alert("Funcionário cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar funcionário:", err);
      alert(err.message);
    }
  };

  const excluirFuncionario = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/funcionarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao excluir funcionário");
      }

      setFuncionarios(funcionarios.filter(f => f.funcionario_id !== id));
      setMostrarModalEdicao(false);
      alert("Funcionário excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir funcionário:", err);
      alert(err.message);
    }
  };

  const abrirModalEdicao = (funcionario) => {
    setFuncionarioEditando(funcionario);
    setNovoFuncionario({
      nome: funcionario.nome,
      telefone: funcionario.telefone,
      endereco: funcionario.endereco,
      usuario: funcionario.usuario,
      senha: "", 
      nivelPermissaoID: funcionario.nivelPermissaoID
    });
    setMostrarModalEdicao(true);
  };

  const salvarEdicao = async () => {
    if (
      !novoFuncionario.nome ||
      !novoFuncionario.telefone ||
      !novoFuncionario.endereco ||
      !novoFuncionario.usuario ||
      !novoFuncionario.nivelPermissaoID
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const dadosAtualizacao = { ...novoFuncionario };
    
    if (!dadosAtualizacao.senha) {
      delete dadosAtualizacao.senha;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/funcionarios/${funcionarioEditando.funcionario_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizacao),
        }
      );

      if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.erro || "Erro ao atualizar funcionário");
      }

      const atualizado = await response.json();
      setFuncionarios(funcionarios.map(f => 
        f.funcionario_id === atualizado.funcionario_id ? atualizado : f
      ));
      
      setMostrarModalEdicao(false);
      setFuncionarioEditando(null);
      alert("Funcionário atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar funcionário:", err);
      alert(err.message);
    }
  };

  const funcionariosFiltrados = funcionarios.filter((funcionario) =>
    funcionario.nome.toLowerCase().includes(busca.toLowerCase()) ||
    funcionario.usuario.toLowerCase().includes(busca.toLowerCase()) ||
    funcionario.nivelPermissaoID.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarNivelPermissao = (nivel) => {
    const formatos = {
      'Administrador': 'Administrador',
      'Engenheiro': 'Engenheiro', 
      'Operador': 'Operador'
    };
    return formatos[nivel.toLowerCase()] || nivel;
  };

  return (
    <div className="funcionario">
      <aside className="menu-lateral">
        <h1>AEROCODE</h1>
        <ul>
          <li><Link to="/Dashboard">Home</Link></li>
          <li><Link to="/Aeronaves">Aeronaves</Link></li>
          <li><Link to="/Pecas">Peças</Link></li>
          <li><Link to="/Etapas">Etapas</Link></li>
          <li><Link to="/Testes">Testes</Link></li>
          {role === "Administrador" && (
            <li><Link to="/funcionarios" className="ativo">Funcionários</Link></li>
          )}
          <li><Link to="/">Sair</Link></li>
        </ul>
      </aside>

      <main className="conteudo">
        <header className="cabecalho">
          <h2>Gerenciamento de Funcionários</h2>
        </header>

        <div className="busca-container">
          <Search className="icone-busca" />
          <input
            type="text"
            placeholder="Procurar Funcionário por nome, usuário ou nível"
            className="input-busca"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="carregando">Carregando funcionários...</div>
        ) : (
          <table className="tabela-funcionarios">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Usuário</th>
                <th>Nível de Permissão</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {funcionariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="vazio">
                    Nenhum funcionário encontrado
                  </td>
                </tr>
              ) : (
                funcionariosFiltrados.map((funcionario) => (
                  <tr key={funcionario.funcionario_id}>
                    <td>{funcionario.nome}</td>
                    <td>{funcionario.telefone}</td>
                    <td>{funcionario.endereco}</td>
                    <td>{funcionario.usuario}</td>
                    <td>{formatarNivelPermissao(funcionario.nivelPermissaoID)}</td>
                    <td>
                      {role === 'Administrador' && (
                        <button
                          className="btn-editar"
                          onClick={() => abrirModalEdicao(funcionario)}
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {role === 'Administrador' && (
          <button className="btn-flutuante" onClick={toggleModalCadastro}>
            <Plus size={22} />
          </button>
        )}

        {/* MODAL CADASTRO */}
        {mostrarModalCadastro && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="fechar-modal" onClick={toggleModalCadastro}>
                <X size={20} />
              </button>
              <h3>Cadastrar Funcionário</h3>
              
              <input
                name="nome"
                value={novoFuncionario.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                required
              />
              
              <select
                name="nivelPermissaoID"
                value={novoFuncionario.nivelPermissaoID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o nível de permissão</option>
                <option value="Administrador">Administrador</option>
                <option value="Engenheiro">Engenheiro</option>
                <option value="Operador">Operador</option>
              </select>
              
              <input
                name="telefone"
                value={novoFuncionario.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                required
              />
              
              <input
                name="endereco"
                value={novoFuncionario.endereco}
                onChange={handleChange}
                placeholder="Endereço completo"
                required
              />
              
              <input
                name="usuario"
                value={novoFuncionario.usuario}
                onChange={handleChange}
                placeholder="Usuário (email)"
                type="email"
                required
              />
              
              <input
                name="senha"
                value={novoFuncionario.senha}
                onChange={handleChange}
                placeholder="Senha"
                type="password"
                required
              />

              <button className="btn-salvar" onClick={handleSalvar}>
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* MODAL EDIÇÃO */}
        {mostrarModalEdicao && funcionarioEditando && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="fechar-modal"
                onClick={() => setMostrarModalEdicao(false)}
              >
                <X size={20} />
              </button>
              <h3>Editar Funcionário</h3>
              
              <input
                name="nome"
                value={novoFuncionario.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                required
              />
              
              <select
                name="nivelPermissaoID"
                value={novoFuncionario.nivelPermissaoID}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o nível de permissão</option>
                <option value="Administrador">Administrador</option>
                <option value="Engenheiro">Engenheiro</option>
                <option value="Operador">Operador</option>
              </select>
              
              <input
                name="telefone"
                value={novoFuncionario.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                required
              />
              
              <input
                name="endereco"
                value={novoFuncionario.endereco}
                onChange={handleChange}
                placeholder="Endereço completo"
                required
              />
              
              <input
                name="usuario"
                value={novoFuncionario.usuario}
                onChange={handleChange}
                placeholder="Usuário (email)"
                type="email"
                required
              />
              
              <input
                name="senha"
                value={novoFuncionario.senha}
                onChange={handleChange}
                placeholder="Nova senha (deixe em branco para manter a atual)"
                type="password"
              />

              <div className="botoes-acao">
                <button className="btn-salvar" onClick={salvarEdicao}>
                  Salvar alterações
                </button>
                <button
                  className="btn-excluir"
                  onClick={() => excluirFuncionario(funcionarioEditando.funcionario_id)}
                >
                  Excluir Funcionário
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Funcionarios;