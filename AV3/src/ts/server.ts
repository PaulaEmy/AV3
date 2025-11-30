import express from "express";
import cors from "cors";
import aeronaveRoutes from "../routes/Aeronave";
import authRoutes from "../routes/authRoutes";
import funcionariosRouter from '../routes/Funcionarios';
import router from "./index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.use("/auth", authRoutes);

app.use('/api/funcionarios', funcionariosRouter);

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
