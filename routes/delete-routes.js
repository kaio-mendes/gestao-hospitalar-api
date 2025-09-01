import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middlewares/auth.js";
const router = express.Router();
const prisma = new PrismaClient();

//para poder remover tem q atribuir tudo que era do outro medico para o outro medico

router.post("/reatribuir-e-deletar/:id", auth, async (req, res) => {
  const isAdmin = req.user?.tipo;
  const { id } = req.params;
  const { newDoctorId } = req.body;

  const userId = parseInt(id);

  if (isAdmin !== "admin")
    return res.status(403).json({ message: "Usuário não é admin" });

  try {
    const doctor = await prisma.user.findUnique({ where: { id: newDoctorId } });
    if (!doctor)
      return res
        .status(404)
        .json({ message: "Médico para atribuição não encontrado" });

    await prisma.paciente.updateMany({
      where: { medicoResponsavelId: userId },
      data: { medicoResponsavelId: newDoctorId },
    });
    await prisma.agendamento.updateMany({
      where: { medicoResponsavelId: userId },
      data: { medicoResponsavelId: newDoctorId },
    });
    await prisma.prescricao.updateMany({
      where: { medicoResponsavelId: userId },
      data: { medicoResponsavelId: newDoctorId },
    });

    const deleted = await prisma.user.delete({ where: { id: userId } });

    return res
      .status(200)
      .json({ message: "Usuário removido e registros reatribuídos", deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao processar a operação" });
  }
});

router.delete("/delete-paciente/:id", auth, async (req, res) => {
  const { id } = req.params;
  const idPaciente = parseInt(id);
  const isAdmin = req.user?.tipo;
  if (isAdmin !== "admin")
    return res.status(403).json({ message: "Usuário não é admin" });

  try {
    await prisma.agendamento.deleteMany({ where: { pacienteId: idPaciente } });
    await prisma.prescricao.deleteMany({ where: { pacienteId: idPaciente } });
    const deleted = await prisma.paciente.delete({ where: { id: idPaciente } });

    return res
      .status(200)
      .json({ message: "Usuário removido e registros reatribuídos", deleted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao processar a operação" });
  }
});

export default router;
