import express from "express";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import publicacionesRoutes from "./routes/publicaciones.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";

const app = express();

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ENDPOINTS DE API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);

//ENDPOINTS AUTH
app.use("/auth", authRoutes);

export default app;
