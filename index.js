import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import formsRoutes from "./routes/forms-routes.js";
import listarItems from "./routes/listar-items.js";
import DeleteItems from "./routes/delete-routes.js";
import auth from "./middlewares/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // URL do seu frontend. Verifique a porta do seu projeto!
    credentials: true, // Isso permite que o navegador envie cookies
  })
);
app.use(cookieParser());

app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);
app.use("/", auth, formsRoutes);
app.use("/", auth, listarItems);
app.use("/", auth, DeleteItems);
app.listen(3000, () => {
  console.log("Rodando 👌");
});

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});
