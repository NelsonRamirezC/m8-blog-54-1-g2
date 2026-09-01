import express from "express";
import * as usuariosControllers from "../controllers/usuarios.controller.js";
//import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

//RUTA OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getAllUsuarios);

//RUTA OBTENER USUARIOS POR SU ID
router.get("/:id", usuariosControllers.getUsuariosById);



export default router;