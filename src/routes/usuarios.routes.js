import express from "express";
import * as usuariosControllers from "../controllers/usuarios.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
//import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

//RUTA OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getAllUsuarios);

//RUTA OBTENER USUARIOS POR SU ID
router.get("/:id", usuariosControllers.getUsuariosById);

//RUTA PARA OBTENER IMAGEN DE AVATAR USUARIO POR ID

router.get("/:id/avatar", usuariosControllers.getAvatarById);

//ELIMINAR USUARIOS POR ID
router.delete("/:id", verifyToken, usuariosControllers.deleteUsuariosById);


export default router;