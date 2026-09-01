import express from "express";
import * as publicacionesControllers from "../controllers/publicaciones.controller.js";
import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

// RUTA CREAR UNA PUBLICACIÓN
router.post("/", validaBody, publicacionesControllers.crearPublicacion);

// RUTA OBTENER TODAS LAS PUBLICACIONES
router.get("/", publicacionesControllers.obtenerTodasPublicaciones);

// RUTA OBTENER PUBLICACIÓN POR ID
router.get("/:id", publicacionesControllers.obtenerPublicacionPorId);

export default router;
