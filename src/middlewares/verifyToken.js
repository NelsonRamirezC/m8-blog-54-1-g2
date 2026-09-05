import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.model.js";


const verifyToken = async (req, res, next) => {
    try {

        if(!req.headers.authorization){
            return res
            .status(401)
            .json({status: "fail", message: "no se proporciona token, inicie sesión en la app."})
        }

        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRETO_JWT);

        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res.status(404).json({
                status: "fail",
                message: "No se ha encontrado un usuario relacionado a su cuenta.",
            });
        }

        if(!usuario.status){
            return res.status(400).json({
                status: "fail",
                message: "Su cuenta se encuentra suspendida, si tiene dudas contacte a soporte: soporte@mail.com",
            });
        }

        req.usuario = usuario.toJSON();

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({status:"Error", message: "Autenticación fallida, vuelva a intentar."})
    }
}

export default verifyToken;