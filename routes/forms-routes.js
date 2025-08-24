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
    console.log("ok");
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

router.post("/setores", async (req, res) => {});
export default router;
