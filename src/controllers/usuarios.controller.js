import Usuario from "../models/Usuario.model.js";

export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ["id", "nombre", "email"],
        });

        res.json({ status: "Ok", usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};

export const getUsuariosById = async (req, res) => {
    try {
        let { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: ["id", "nombre", "email"],
        });

        if (!usuario) {
            return res
                .status(404)
                .json({
                    status: "Not found",
                    message: "No se encontró ningún usuario con el ID. " + id,
                });
        }

        res.json({ status: "Ok", usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
