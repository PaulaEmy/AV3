import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  const user = await prisma.funcionario.findFirst({
    where: { usuario, senha }
  });

  if (!user) {
    return res.status(401).json({ error: "Usuário ou senha incorretos" });
  }

  return res.json({
    message: "Login realizado com sucesso !!",
    usuario: user.usuario,
    nivel: user.nivelPermissaoID
  });
});

export default router;
