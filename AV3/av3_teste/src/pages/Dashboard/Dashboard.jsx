import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const role = localStorage.getItem("userRole");
  const [proximasEtapas, setProximasEtapas] = useState([]);
  const [dadosEtapas, setDadosEtapas] = useState({
    pendente: 0,
    andamento: 0,
    concluidas: 0
  });

  const [dadosTestes, setDadosTestes] = useState({
    aprovados: 0,
    reprovados: 0
  });

  const [resumoProducao, setResumoProducao] = useState({
    concluido: 0,
    andamento: 0
  });

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        
        const responseEtapas = await fetch("http://localhost:3000/api/etapas");
        const etapas = await responseEtapas.json();

        const responseTestes = await fetch("http://localhost:3000/api/testes");
        const testes = await responseTestes.json();

        const responseAeronaves = await fetch("http://localhost:3000/api/aeronaves");
        const aeronaves = await responseAeronaves.json();

        const etapasOrdenadas = etapas.sort(
          (a, b) => new Date(a.prazo) - new Date(b.prazo)
        );
        setProximasEtapas(etapasOrdenadas.slice(0, 3));

        const pendente = etapas.filter(e => e.statusEtapaID === "Pendente").length;
        const andamento = etapas.filter(e => e.statusEtapaID === "Andamento").length;
        const concluidas = etapas.filter(e => e.statusEtapaID === "Concluída").length;
        setDadosEtapas({ pendente, andamento, concluidas });

        const aprovados = testes.filter(t => t.resultadoTesteID === "Aprovado").length;
        const reprovados = testes.filter(t => t.resultadoTesteID === "Reprovado").length;
        setDadosTestes({ aprovados, reprovados });

        let concluidasProducao = 0;
        let andamentoProducao = 0;

        aeronaves.forEach(aeronave => {
          const testesAeronave = testes.filter(t => t.aeronaveID === aeronave.codigo);
          
          if (testesAeronave.length === 0) {
            andamentoProducao++;
          } else {
            const temAprovado = testesAeronave.some(t => t.resultadoTesteID === "Aprovado");
            if (temAprovado) {
              concluidasProducao++;
            } else {
              andamentoProducao++;
            }
          }
        });

        setResumoProducao({ concluido: concluidasProducao, andamento: andamentoProducao });

      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        alert("Erro ao carregar dados do dashboard");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const etapasChartData = {
    labels: ["Pendente", "Em andamento", "Concluídas"],
    datasets: [
      {
        data: [dadosEtapas.pendente, dadosEtapas.andamento, dadosEtapas.concluidas],
        backgroundColor: ["#fca5a5", "#fcd34d", "#86efac"],
        borderWidth: 1,
      }
    ]
  };

  const testesChartData = {
    labels: ["Aprovados", "Reprovados"],
    datasets: [
      {
        data: [dadosTestes.aprovados, dadosTestes.reprovados],
        backgroundColor: ["#86efac", "#fca5a5"],
        borderWidth: 1,
      }
    ]
  };

  if (carregando) {
    return (
      <div className="dashboard">
        <aside className="menu-lateral">
          <h1>AEROCODE</h1>
          <ul>
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/aeronaves">Aeronaves</Link></li>
            <li><Link to="/pecas">Peças</Link></li>
            <li><Link to="/etapas">Etapas</Link></li>
            <li><Link to="/testes">Testes</Link></li>
            {role === "Administrador" && (
              <li><Link to="/funcionarios">Funcionários</Link></li>
            )}
            <li><Link to="/">Sair</Link></li>
          </ul>
        </aside>
        <main className="conteudo-dashboard">
          <div className="carregando">Carregando dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="menu-lateral">
        <h1>AEROCODE</h1>
        <ul>
          <li><Link to="/dashboard" className="ativo">Home</Link></li>
          <li><Link to="/aeronaves">Aeronaves</Link></li>
          <li><Link to="/pecas">Peças</Link></li>
          <li><Link to="/etapas">Etapas</Link></li>
          <li><Link to="/testes">Testes</Link></li>
          {role === "Administrador" && (
            <li><Link to="/funcionarios">Funcionários</Link></li>
          )}
          <li><Link to="/">Sair</Link></li>
        </ul>
      </aside>

      <main className="conteudo-dashboard">
        <h1>Aerocode</h1>
        <h2>Bem-vindo usuário!</h2>

        <div className="container">
          <div className="etapas-container">
            <h3>Próximas Etapas</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Prazo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {proximasEtapas.length === 0 ? (
                  <tr><td colSpan="3">Nenhuma etapa cadastrada</td></tr>
                ) : (
                  proximasEtapas.map((etapa) => (
                    <tr key={etapa.id_etapa}>
                      <td>#{etapa.id_etapa}</td>
                      <td>{formatarData(etapa.prazo)}</td>
                      <td>{etapa.statusEtapaID}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="prod-container">
            <h3>Resumo da Produção</h3>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{resumoProducao.andamento}</span>
                <span className="stat-label">Em andamento</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{resumoProducao.concluido}</span>
                <span className="stat-label">Concluídas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="graficos-container">
          <div className="grafico">
            <h3>Status das Etapas</h3>
            {dadosEtapas.pendente === 0 && dadosEtapas.andamento === 0 && dadosEtapas.concluidas === 0 ? (
              <div className="sem-dados">Nenhuma etapa cadastrada</div>
            ) : (
              <Doughnut data={etapasChartData} />
            )}
          </div>

          <div className="grafico">
            <h3>Resultados dos Testes</h3>
            {dadosTestes.aprovados === 0 && dadosTestes.reprovados === 0 ? (
              <div className="sem-dados">Nenhum teste cadastrado</div>
            ) : (
              <Doughnut data={testesChartData} />
            )}
          </div>
        </div>

        <div className="resumo-rapido">
          <div className="card-resumo">
            <h4>Total de Etapas</h4>
            <span className="numero-grande">{dadosEtapas.pendente + dadosEtapas.andamento + dadosEtapas.concluidas}</span>
          </div>
          <div className="card-resumo">
            <h4>Total de Testes</h4>
            <span className="numero-grande">{dadosTestes.aprovados + dadosTestes.reprovados}</span>
          </div>
          <div className="card-resumo">
            <h4>Aeronaves</h4>
            <span className="numero-grande">{resumoProducao.andamento + resumoProducao.concluido}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;