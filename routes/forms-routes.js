import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middlewares/auth.js";
const router = express.Router();
const prisma = new PrismaClient();

router.post("/novo-setor", auth, async (req, res) => {
  try {
    const newDepartment = req.body;
    const department = await prisma.department.create({
      data: {
        name: newDepartment.name,
        head: newDepartment.head,
      },
    });
    res.status(201).json(department);
  } catch (error) {
    console.log(error);
  }
});

router.post("/novo-profissional", auth, async (req, res) => {
  try {
    const newProfessional = req.body;
    const professional = await prisma.department.create({
      data: {
        name: newProfessional.name,
        head: newProfessional.head,
      },
    });
    res.status(201).json(department);
  } catch (error) {
    console.log(error);
  }
});

router.post("/novo-quarto", auth, async (req, res) => {
  try {
    const beds = req.body;
    const newBed = await prisma.rooms.create({
      data: {
        room_name: beds.room_name,
        room_number: beds.room_number,
        room_beds: beds.room_beds,
        department: beds.department,
      },
    });
    res.status(200).json({ message: "quarto criado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar quarto" });
  }
});

router.post("/pacientes", auth, async (req, res) => {
  try {
    const {
      nome,
      cpf,
      data_nascimento,
      idade,
      genero,
      estado_civil,
      telefone,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      nome_emergencia,
      telefone_emergencia,
      endereco_emergencia,
      medicoResponsavelId,
    } = req.body;

    if (!nome || !cpf || !data_nascimento) {
      return res.status(400).json({ message: "Dados obrigatórios faltando." });
    }

    // Verifica se o médico existe
    let medico = null;
    if (medicoResponsavelId) {
      medico = await prisma.user.findUnique({
        where: { id: medicoResponsavelId },
      });
      if (!medico || medico.tipo !== "medico") {
        return res
          .status(400)
          .json({ message: "Médico responsável não existe." });
      }
    }

    const paciente = await prisma.paciente.create({
      data: {
        nome,
        cpf,
        data_nascimento: new Date(data_nascimento),
        idade,
        genero,
        estado_civil,
        telefone,
        endereco,
        bairro,
        cidade,
        estado,
        cep,
        nome_emergencia,
        telefone_emergencia,
        endereco_emergencia,
        medicoResponsavelId: medico?.id || null,
      },
    });

    return res.status(201).json(paciente);
  } catch (error) {
    console.error("Erro ao criar paciente:", error);

    return res.status(500).json({ message: "Erro no servidor" });
  }
});

router.post("/agendar", auth, async (req, res) => {
  try {
    const dadosAgenda = req.body;
    const consulta = await prisma.agendamento.create({
      data: {
        pacienteId: dadosAgenda.pacienteId,
        medicoResponsavelId: dadosAgenda.medicoResponsavelId,
        observacao: dadosAgenda.observacao,
        dataConsulta: dadosAgenda.dataConsulta,
        horaConsulta: dadosAgenda.horaConsulta,
      },
    });
    return res.status(201).json(dadosAgenda);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

router.post("/laudo", auth, async (req, res) => {
  try {
    const laudo = req.body;
    const idAgenda = parseInt(req.body.agendamentoId);

    const informaçõesLaudo = await prisma.prescricao.create({
      data: {
        pacienteId: laudo.pacienteId,
        medicoResponsavelId: laudo.medicoResponsavelId,
        dataConsulta: laudo.dataConsulta,
        horaConsulta: laudo.horaConsulta,
        sintomas: laudo.sintomas,
        observacao: laudo.observacao,
        prescricao: laudo.prescricao,
      },
    });
    await prisma.agendamento.update({
      where: { id: idAgenda },
      data: { finalizado: true },
    });
    return res.status(200).json({ message: "tudo certo" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});
export default router;
