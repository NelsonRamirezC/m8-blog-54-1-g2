import express from "express";
import * as authControllers from "../controllers/auth.controller.js";
import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

//RUTA PARA REGISTRAR USUARIOS
router.post("/registro", validaBody, authControllers.registroUsuario);

//RUTA LOGIN USUARIOS
router.post("/login", validaBody, authControllers.loginUsuario);


export default router;