import express from "express";
import { PrismaClient } from "@prisma/client";
import auth from "../middlewares/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/user-info", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    res.status(200).json({ userInfo });
  } catch (err) {
    console.log(err);
  }
});

router.post("/logout", auth, async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none",
  });
  res.send(200).json({ message: "tudo certo" });
});

export default router;
