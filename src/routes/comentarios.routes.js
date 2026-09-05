import express from "express";
import * as comentariosControllers from "../controllers/comentarios.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

// RUTA CREAR UN COMENTARIO
router.post("/", validaBody, verifyToken, comentariosControllers.crearComentario);

export default router;
