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
  try {
    const department = await prisma.department.findMany();

    res.status(200).json({ department });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ message: "Falha no servidor" });
  }
});

router.get("/profissionais", auth, async (req, res) => {
  const allowUser = req.user?.tipo;
  if (allowUser == "admin" || allowUser == "secretario") {
    try {
      const professionals = await prisma.user.findMany({
        where: { tipo: "medico" },
        select: {
          id: true,
          name: true,
          setor: true,
          tipo: true,
        },
      });

      res.status(200).json({ professionals });
    } catch (error) {
      console.error("Erro ao listar profissionais:", error);
      return res.status(500).json({ message: "Falha no servidor" });
    }
  } else {
    return res.status(404).json({ message: "Usuario nao eh permitido" });
  }
});

router.get("/pacientes", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário logado
    const userType = req.user.tipo; // 'medico', 'secretaria', 'admin', etc.

    let pacientes;

    if (userType === "medico") {
      // Médico só vê seus próprios pacientes
      pacientes = await prisma.paciente.findMany({
        where: { medicoResponsavelId: userId },
        include: {
          medicoResponsavel: { select: { id: true, name: true } },
        },
      });
    } else if (userType === "admin" || userType === "secretario") {
      // Admin e secretaria veem todos os pacientes
      pacientes = await prisma.paciente.findMany({
        include: {
          medicoResponsavel: { select: { id: true, name: true } },
        },
      });
    } else {
      return res.status(403).json({ message: "Acesso negado" });
    }

    res.json({ pacientes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao listar pacientes" });
  }
});

router.get("/profissionais/:id/pacientes", async (req, res) => {
  try {
    const { id } = req.params;
    const userType = req.user.tipo;

    // Médico só pode consultar a própria lista
    if (userType === "medico" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const pacientes = await prisma.paciente.findMany({
      where: { medicoResponsavelId: parseInt(id) },
      include: {
        medicoResponsavel: { select: { id: true, name: true } },
      },
    });

    res.json({ pacientes });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pacientes do médico" });
  }
});

router.get("/agendamento", async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário logado
    const userType = req.user.tipo; // 'medico', 'secretaria', 'admin', etc.

    let agendamentos;

    if (userType === "medico") {
      // Médico só vê seus agendamentos
      agendamentos = await prisma.agendamento.findMany({
        where: { medicoResponsavelId: userId },
        include: {
          paciente: { select: { id: true, nome: true } },
          medicoResponsavel: { select: { id: true, name: true } },
        },
      });
    } else if (userType === "admin" || userType === "secretario") {
      // Admin e secretaria veem todos os agendamentos
      agendamentos = await prisma.agendamento.findMany({
        include: {
          paciente: { select: { id: true, nome: true } },
          medicoResponsavel: { select: { id: true, name: true } },
        },
      });
    } else {
      return res.status(403).json({ message: "Acesso negado" });
    }

    res.status(200).json({ agendamentos });
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    return res.status(500).json({ message: "Falha no servidor" });
  }
});

router.get("/laudo/:id", auth, async (req, res) => {
  try {
    const pacienteId = req.params.id;
    const id = parseInt(pacienteId);
    const laudoPaciente = await prisma.prescricao.findMany({
      where: { pacienteId: id },
      include: {
        paciente: { select: { id: true, nome: true } },
        medicoResponsavel: { select: { id: true, name: true } },
      },
    });
    res.json({ laudoPaciente });
  } catch (error) {
    console.log(error);
  }
});

export default router;
