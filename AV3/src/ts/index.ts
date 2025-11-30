import { PrismaClient } from '@prisma/client'
import express from "express";
const router = express.Router();

const prisma = new PrismaClient()

// ~=~=~=~=~=~=~=~=~= AERONAVES ~=~=~=~=~=~=~=~=~=

// CREATE
export async function criarAeronave(dados: {
    modelo: string;
    tipoAeronaveID: string;
    capacidade: number;
    alcance: number;
    cliente: string;
}) {
    return prisma.aeronave.create({data: dados});
}

// READ MANY
export async function listarAeronaves() {
    return prisma.aeronave.findMany({
        include: {
            testes: true
        }
    });
}

// READ ONE
export async function buscarAeronave(codigo:number) {
    return prisma.aeronave.findUnique({
        where: {codigo},
        include: {
            testes: true
        }
    });
}

// UPDATE
export async function atualizarAeronave(codigo: number, dados: any) {
  return prisma.aeronave.update({
    where: { codigo },
    data: dados
  });
}

// DELETE
export async function removerAeronave(codigo: number) {
  return prisma.aeronave.delete({
    where: { codigo }
  });
}

// ~=~=~=~=~=~=~=~=~= PEÇAS ~=~=~=~=~=~=~=~=~=

// CREATE
export async function criarPeca(dados: {
  nomePeca: string;
  tipoPecaID: string;
  fornecedor: string;
  statusPecaID: string;
  aeronaveID?: string | number | null; 
}) {
  return prisma.peca.create({
    data: {
      nomePeca: dados.nomePeca,
      tipoPecaID: dados.tipoPecaID,
      fornecedor: dados.fornecedor,
      statusPecaID: dados.statusPecaID,
      aeronaveID:
        dados.aeronaveID && !isNaN(Number(dados.aeronaveID))
          ? Number(dados.aeronaveID)
          : null, 
    },
    include: {
      aeronave: true, 
      tipoPeca: true,
      statusPeca: true,
    },
  });
}

// READ MANY
export async function listarPecas() {
  return prisma.peca.findMany({
    include: {
      tipoPeca: true,
      statusPeca: true,
      aeronave: true, 
    },
  });
}

// UPDATE
export async function atualizarPeca(id_peca: number, dados: any) {
  const dadosAtualizados = {
    ...dados,
    aeronaveID: dados.aeronaveID && !isNaN(Number(dados.aeronaveID)) 
      ? Number(dados.aeronaveID) 
      : null
  };

  return prisma.peca.update({
    where: { id_peca },
    data: dadosAtualizados,
    include: {
      aeronave: true,
      tipoPeca: true,
      statusPeca: true,
    }
  });
}

// DELETE
export async function removerPeca(id_peca: number) {
  try {
    return prisma.peca.delete({
      where: { id_peca },
    });
  } catch (err: any) {
    throw new Error(
      "Não foi possível excluir a peça. Verifique se ela está vinculada a alguma aeronave ou teste."
    );
  }
}

// ~=~=~=~=~=~=~=~=~= TESTES ~=~=~=~=~=~=~=~=~=

// CREATE
export async function criarTeste(dados: {
  resultadoTesteID: string;
  aeronaveID: number;
  tipoTesteID: string;
}) {
  return prisma.teste.create({ data: dados });
}

// UPDATE
export async function atualizarTeste(id_teste: number, dados: any) {
  return prisma.teste.update({
    where: { id_teste },
    data: {
      resultadoTesteID: dados.resultadoTesteID,
      tipoTesteID: dados.tipoTesteID,
      aeronaveID: Number(dados.aeronaveID),
    },
    include: {
      resultadoTeste: true,
      tipoTeste: true,
      aeronave: true,
    }
  });
}


// READ MANY
export async function listarTestes() {
  return prisma.teste.findMany({
    orderBy: { id_teste: 'asc' }
  });

}

// ~=~=~=~=~=~=~=~=~= ETAPAS ~=~=~=~=~=~=~=~=~=

// CREATE
export async function criarEtapa(dados: {
  prazo: string;
  statusEtapaID: string;
}) {
  return prisma.etapa.create({ 
    data: dados,
    include: {
      statusEtapa: true,
      funcionarios: true
    }
  });
}

// READ MANY
export async function listarEtapas() {
  return prisma.etapa.findMany({
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    },
    orderBy: {
      id_etapa: 'asc'
    }
  });
}

// READ ONE
export async function buscarEtapa(id_etapa: number) {
  return prisma.etapa.findUnique({
    where: { id_etapa },
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    }
  });
}

// UPDATE
export async function atualizarEtapa(id_etapa: number, dados: any) {
  return prisma.etapa.update({
    where: { id_etapa },
    data: dados,
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    }
  });
}

// DELETE 
export async function removerEtapa(id_etapa: number) {
  return prisma.etapa.delete({
    where: { id_etapa }
  });
}

// UPDATE (INICIAR)
export async function iniciarEtapa(id_etapa: number) {
  return prisma.etapa.update({
    where: { id_etapa },
    data: { statusEtapaID: "Andamento" },
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    }
  });
}

// UPDATE (CONCLUIR)
export async function concluirEtapa(id_etapa: number) {
  return prisma.etapa.update({
    where: { id_etapa },
    data: { statusEtapaID: "Concluída" },
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    }
  });
}

// UPDATE (ASSOCIAR FUNCIONÁRIO)
export async function associarFuncionario(etapaId: number, funcionarioId: number) {
  return prisma.etapa.update({
    where: { id_etapa: etapaId },
    data: {
      funcionarios: {
        connect: { funcionario_id: funcionarioId }
      }
    },
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    }
  });
}

// UPDATE (REMOVER FUNCIONÁRIO)
export async function removerFuncionarioEtapa(etapaId: number, funcionarioId: number) {
  return prisma.etapa.update({
    where: { id_etapa: etapaId },
    data: {
      funcionarios: {
        disconnect: { funcionario_id: funcionarioId }
      }
    },
    include: { 
      statusEtapa: true, 
      funcionarios: true 
    }
  });
}

// ~=~=~=~=~=~=~=~=~= FUNCIONÁRIOS ~=~=~=~=~=~=~=~=~=

// CREATE
export async function criarFuncionario(dados: {
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissaoID: string;
}) {
    return prisma.funcionario.create({data: dados});
}

// READ MANY
export async function listarFuncionarios() {
    return prisma.funcionario.findMany({
        include: {
            nivelPermissao: true
        }
    });
}

// READ ONE
export async function buscarFuncionario(funcionario_id:number) {
    return prisma.funcionario.findUnique({
        where: {funcionario_id},
    });
}

// UPDATE
export async function atualizarFuncionario(funcionario_id: number, dados: any) {
  return prisma.funcionario.update({
    where: { funcionario_id },
    data: dados
  });
}

// DELETE
export async function removerFuncionario(funcionario_id: number) {
  return prisma.funcionario.delete({
    where: { funcionario_id }
  });
}

// ROTAS DE AERONAVES 

// CREATE
router.post("/aeronaves", async (req, res) => {
  try {
    const nova = await criarAeronave(req.body);
    res.json(nova);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// READ
router.get("/aeronaves", async (_req, res) => {
  const lista = await listarAeronaves();
  res.json(lista);
});

// UPDATE
router.put("/aeronaves/:codigo", async (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    const atualizada = await atualizarAeronave(codigo, req.body);
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// DELETE
router.delete("/aeronaves/:codigo", async (req, res) => {
  try {
    const codigo = Number(req.params.codigo);
    const removida = await removerAeronave(codigo);
    res.json(removida);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// ROTAS DE PEÇAS 

// === ROTAS DE PEÇAS ===

// CREATE
router.post("/pecas", async (req, res) => {
  try {
    const nova = await criarPeca(req.body);
    res.json(nova);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// READ
router.get("/pecas", async (_req, res) => {
  const lista = await listarPecas();
  res.json(lista);
});

// UPDATE
router.put("/pecas/:id_peca", async (req, res) => {
  try {
    const id_peca = Number(req.params.id_peca);
    const atualizada = await atualizarPeca(id_peca, req.body);
    res.json(atualizada);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// DELETE
router.delete("/pecas/:id_peca", async (req, res) => {
  try {
    const id_peca = Number(req.params.id_peca);
    const removida = await removerPeca(id_peca);
    res.json(removida);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// ROTAS DE FUNCIONÁRIOS

// CREATE
router.post("/funcionarios", async (req, res) => {
  try {
    const novo = await criarFuncionario(req.body);
    res.json(novo);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// READ
router.get("/funcionarios", async (_req, res) => {
  try {
    const lista = await listarFuncionarios();
    res.json(lista);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

// READ ONE
router.get("/funcionarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const funcionario = await buscarFuncionario(id);
    if (!funcionario) {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }
    res.json(funcionario);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
router.put("/funcionarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const atualizado = await atualizarFuncionario(id, req.body);
    res.json(atualizado);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// DELETE
router.delete("/funcionarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await removerFuncionario(id);
    res.json({ message: "Funcionário removido com sucesso" });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// ROTAS DE TESTES

// CREATE
router.post("/testes", async (req, res) => {
  try {
    const novo = await criarTeste(req.body);
    res.json(novo);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// READ
router.get("/testes", async (_req, res) => {
  try {
    const lista = await listarTestes();
    res.json(lista);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

// READ ONE
router.get("/testes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const teste = await prisma.teste.findUnique({
      where: { id_teste: id },
      include: {
        tipoTeste: true,
        resultadoTeste: true,
        aeronave: true
      }
    });
    if (!teste) {
      return res.status(404).json({ erro: "Teste não encontrado" });
    }
    res.json(teste);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
router.put("/testes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const atual = await prisma.teste.findUnique({
      where: { id_teste: id }
    });

    if (!atual) {
      return res.status(404).json({ erro: "Teste não encontrado" });
    }

    const dados = {
      resultadoTesteID: req.body.resultadoTesteID ?? atual.resultadoTesteID,
      tipoTesteID: req.body.tipoTesteID ?? atual.tipoTesteID,
      aeronaveID: req.body.aeronaveID
        ? Number(req.body.aeronaveID)
        : atual.aeronaveID
    };

    const atualizado = await prisma.teste.update({
      where: { id_teste: id },
      data: dados,
      include: {
        tipoTeste: true,
        resultadoTeste: true,
        aeronave: true
      }
    });

    res.json(atualizado);

  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});


// DELETE
router.delete("/testes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.teste.delete({
      where: { id_teste: id }
    });
    res.json({ message: "Teste removido com sucesso" });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// ROTAS DE ETAPAS

// CREATE
router.post("/etapas", async (req, res) => {
  try {
    const dados = {
      ...req.body,
      statusEtapaID: "Pendente",
    };

    const nova = await prisma.etapa.create({
      data: dados,
    });

    res.json(nova);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});


// READ
router.get("/etapas", async (_req, res) => {
  try {
    const lista = await listarEtapas();
    res.json(lista);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

// READ ONE
router.get("/etapas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const etapa = await buscarEtapa(id);
    if (!etapa) {
      return res.status(404).json({ erro: "Etapa não encontrada" });
    }
    res.json(etapa);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE
router.put("/etapas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const etapaAtual = await prisma.etapa.findUnique({
      where: { id_etapa: id },
    });

    if (!etapaAtual) {
      return res.status(404).json({ erro: "Etapa não encontrada" });
    }

    const novoStatus = req.body.statusEtapaID;

    if (etapaAtual.statusEtapaID === "Pendente" && novoStatus === "Concluída") {
      return res.status(400).json({
        erro: "A etapa deve passar por 'Andamento' antes de ser concluída.",
      });
    }

    if (etapaAtual.statusEtapaID === "Pendente" && novoStatus !== "Andamento") {
      return res.status(400).json({
        erro: "A etapa pendente só pode avançar para 'Andamento'.",
      });
    }

    const atualizado = await prisma.etapa.update({
      where: { id_etapa: id },
      data: req.body,
    });

    res.json(atualizado);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});


// DELETE
router.delete("/etapas/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await removerEtapa(id);
    res.json({ message: "Etapa removida com sucesso" });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// INICIAR ETAPA
router.put("/etapas/:id/iniciar", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const etapa = await iniciarEtapa(id);
    res.json(etapa);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// CONCLUIR ETAPA
router.put("/etapas/:id/concluir", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const etapa = await concluirEtapa(id);
    res.json(etapa);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// ASSOCIAR FUNCIONÁRIO
router.put("/etapas/:id/funcionarios/:funcionarioId", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const funcionarioId = Number(req.params.funcionarioId);
    const etapa = await associarFuncionario(id, funcionarioId);
    res.json(etapa);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// REMOVER FUNCIONÁRIO
router.delete("/etapas/:id/funcionarios/:funcionarioId", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const funcionarioId = Number(req.params.funcionarioId);
    const etapa = await removerFuncionarioEtapa(id, funcionarioId);
    res.json(etapa);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;