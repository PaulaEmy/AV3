import { Router } from "express";
import {
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  removerFuncionario,
  buscarFuncionario
} from "../ts/index";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const dados = await listarFuncionarios();
    res.json(dados);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const dados = await criarFuncionario(req.body);
    res.json(dados);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dados = await buscarFuncionario(id);
    if (!dados) {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }
    res.json(dados);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dados = await atualizarFuncionario(id, req.body);
    res.json(dados);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await removerFuncionario(id);
    res.json({ message: "Funcionário removido com sucesso" });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;