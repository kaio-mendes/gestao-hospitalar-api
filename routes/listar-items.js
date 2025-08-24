import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middlewares/auth.js";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/listar-usuarios", auth, async (req, res) => {
  //vai verificar auth
  const isAdmin = req.user?.tipo; //recebe informacao se eh admin
  if (isAdmin == "admin") {
    //se for admin
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          tipo: true,
        },
      });
      res.status(200).json({ users });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Falha no servidor" });
    }
  } else {
    return res.status(404).json({ message: "Usuario nao eh administrador" });
  }
});

router.get("/listar-departamentos", auth, async (req, res) => {
  const isAdmin = req.user?.tipo;
  if (isAdmin == "admin") {
    try {
      const department = await prisma.department.findMany();

      res.status(200).json({ department });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({ message: "Falha no servidor" });
    }
  } else {
    return res.status(404).json({ message: "Usuario nao eh administrador" });
  }
});

export default router;
