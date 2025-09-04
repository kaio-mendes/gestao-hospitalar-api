import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient(); //iniciando o prisma
const router = express.Router(); //utilizando apenas o roteamento do express
const jwt_secret = process.env.JWT_SECRET; //recebendo o secret JWT gerado

//cadastro

router.post("/cadastro", async (req, res) => {
  try {
    const newUser = req.body; //vai pegar as informacoes que o usuario passar

    if (!newUser.name || !newUser.email || !newUser.password) {
      return res
        .status(400)
        .json({ message: "Nome, email e senha são obrigatórios." });
    }

    const salt = await bcrypt.genSalt(10); //gerando um bcrypt padrao de 10 caracter
    const hashPassword = await bcrypt.hash(newUser.password, salt); //convertendo para hash

    const userDB = await prisma.user.create({
      //organizando para entrar no banco de dados
      data: {
        name: newUser.name,
        email: newUser.email,
        password: hashPassword,
        setor: newUser.setor ?? "",
        tipo: newUser.tipo ?? "", //usuario sem atributo
      },
    });
    const { password, ...userWithoutPassword } = userDB;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body; //vai pegar a informacao que o usuario digitou no body
    const user = await prisma.user.findUnique({
      //vai encontrar um unico item igual
      where: {
        email: userInfo.email, //vai pegar o nome
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo, name: user.name },
      jwt_secret,
      {
        //esta guardando id e admin true/false
        expiresIn: "120m",
      }
    ); //expira em 1 hora a secao
    //res.status(200).json({ token, admin: user.admin });

    res.status(200).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
      maxAge: 120 * 60 * 1000,
    });
    res
      .status(200)
      .json({ message: "Login realizado com sucesso", tipo: user.tipo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Falha ao logar" });
  }
});

export default router;
