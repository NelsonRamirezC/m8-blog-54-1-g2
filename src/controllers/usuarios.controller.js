import Usuario from "../models/Usuario.model.js";

export const getAllUsuarios = async (req, res) => {
    try {

        let { offset, limit, sortBy, direction } = req.query;

        const order = [];

        if(sortBy){
            if(direction){
                direction = direction.toUpperCase().trim();
                direction = direction == "DESC" ? "DESC" : "ASC";
            }else {
                direction = "ASC";
            }
            order.push([sortBy, direction])
        }
        
        const { count, rows } = await Usuario.findAndCountAll({
            attributes: ["id", "nombre", "email"],
            offset: isNaN(Number(offset)) ? undefined : offset,
            limit: isNaN(Number(limit)) ? undefined : limit,
            order
        });

        res.json({ status: "Ok", totalUsuariosDB: count, usuarios:rows });
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
            return res.status(404).json({
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
