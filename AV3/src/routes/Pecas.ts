import { Router } from "express";
import {
  listarPecas,
  criarPeca,
  atualizarPeca,
  removerPeca
} from "../ts/index";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const dados = await listarPecas();
    res.json(dados);
  } catch (err: any) {
    res.status(500).json({ erro: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const dados = await criarPeca(req.body);
    res.json(dados);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dados = await atualizarPeca(id, req.body);
    res.json(dados);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await removerPeca(id);
    res.json({ message: "Peça removida com sucesso" });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

export default router;