import Usuario from "../models/Usuario.model.js";

export const getAllUsuarios = async (req, res) => {
    try {

        const usuarios = await Usuario.findAll({
            attributes: ["id", "nombre", "email"]
        });

        res.json({status: "Ok", usuarios});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
}