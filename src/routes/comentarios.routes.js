import express from "express";
import * as comentariosControllers from "../controllers/comentarios.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

// RUTA CREAR UN COMENTARIO
router.post("/", validaBody, verifyToken, comentariosControllers.crearComentario);

//ELIMINAR COMENTARIOS POR ID
router.delete("/:id", verifyToken, comentariosControllers.eliminarComentario);

export default router;
