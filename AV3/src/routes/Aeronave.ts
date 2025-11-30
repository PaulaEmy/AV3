import { Router } from "express";
import {
  listarAeronaves,
  criarAeronave,
  atualizarAeronave,
  removerAeronave,
  buscarAeronave
} from "../ts/index";

const router = Router();

router.get("/", async (req, res) => {
  const dados = await listarAeronaves();
  res.json(dados);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const dados = await buscarAeronave(id);
  res.json(dados);
});

router.post("/", async (req, res) => {
  const dados = await criarAeronave(req.body);
  res.json(dados);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const dados = await atualizarAeronave(id, req.body);
  res.json(dados);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const dados = await removerAeronave(id);
  res.json({ message: "Aeronave removida" });
});

export default router;
