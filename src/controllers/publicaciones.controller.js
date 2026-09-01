import Publicacion from "../models/Publicacion.model.js";
import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

export const crearPublicacion = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { titulo, contenido, usuarioId } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!titulo || !contenido || !usuarioId) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcionaron los campos requeridos [titulo, contenido, usuarioId]",
            });
        }

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "El usuario especificado no existe",
            });
        }

        // Crear la publicación
        const publicacion = await Publicacion.create(
            {
                titulo,
                contenido,
                usuarioId,
            },
            { transaction: t },
        );

        await t.commit();
        res.status(201).json({
            status: "Created",
            message: "Publicación creada con éxito",
            publicacion: {
                id: publicacion.id,
                titulo: publicacion.titulo,
                contenido: publicacion.contenido,
                usuarioId: publicacion.usuarioId,
                createdAt: publicacion.createdAt,
            },
        });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};

export const obtenerTodasPublicaciones = async (req, res) => {
    try {
        let { offset, limit, sortBy, direction } = req.query;

        const order = [];

        if (sortBy) {
            if (direction) {
                direction = direction.toUpperCase().trim();
                direction = direction === "DESC" ? "DESC" : "ASC";
            } else {
                direction = "ASC";
            }
            order.push([sortBy, direction]);
        }

        const { count, rows } = await Publicacion.findAndCountAll({
            attributes: [
                "id",
                "titulo",
                "contenido",
                "usuarioId",
                "createdAt",
                "updatedAt",
            ],
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id", "nombre", "email"],
                },
            ],
            offset: isNaN(Number(offset)) ? undefined : offset,
            limit: isNaN(Number(limit)) ? undefined : limit,
            order: order.length > 0 ? order : [["createdAt", "DESC"]],
        });

        res.json({
            status: "Ok",
            totalPublicacionesDB: count,
            publicaciones: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};

export const obtenerPublicacionPorId = async (req, res) => {
    try {
        let { id } = req.params;

        const publicacion = await Publicacion.findByPk(id, {
            attributes: [
                "id",
                "titulo",
                "contenido",
                "usuarioId",
                "createdAt",
                "updatedAt",
            ],
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["id", "nombre", "email"],
                },
            ],
        });

        if (!publicacion) {
            return res.status(404).json({
                status: "Not found",
                message: "No se encontró ninguna publicación con el ID: " + id,
            });
        }

        res.json({
            status: "Ok",
            publicacion,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
