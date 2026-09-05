import Comentario from "../models/Comentario.model.js";
import Usuario from "../models/Usuario.model.js";
import Publicacion from "../models/Publicacion.model.js";
import sequelize from "../config/database.js";

export const crearComentario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { contenido, publicacionId } = req.body;

        // Validar que los campos requeridos estén presentes
        if (!contenido || !publicacionId) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcionaron los campos requeridos [contenido, publicacionId]",
            });
        }

        // Verificar que la publicación existe
        const publicacion = await Publicacion.findByPk(publicacionId);
        if (!publicacion) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "La publicación especificada no existe",
            });
        }

        // Crear el comentario
        const comentario = await Comentario.create(
            {
                contenido,
                usuarioId: req.usuario.id,
                publicacionId,
            },
            { transaction: t },
        );

        await t.commit();
        res.status(201).json({
            status: "Created",
            message: "Comentario creado con éxito",
            comentario: {
                id: comentario.id,
                contenido: comentario.contenido,
                usuarioId: comentario.usuarioId,
                publicacionId: comentario.publicacionId,
                fechaCreacion: comentario.fecha_creacion,
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

export const eliminarComentario = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { id } = req.params;

        const comentario = await Comentario.findByPk(id, {
            include: [
                {
                    model: Publicacion,
                    as: "publicacion",
                },
            ],
            transaction: t,
        });

        if (!comentario) {
            await t.rollback();
            res.status(404).json({
                status: "Not found",
                message: "No existe ningún comentario con id:" + id,
            });
        }

        //ELIMINAR COMENTARIO
        if (
            req.usuario.admin ||
            comentario.usuarioId == req.usuario.id ||
            comentario.publicacion.usuarioId == req.usuario.id
        ) {
            await comentario.destroy({ transaction: t});
            await t.commit();
            return res.status(200).json({status: "success", message: "Comentario eliminado con éxito."});
        }else {

            return res.status(403).json({ status: "fail", message: "Usted no tiene permisos para eliminar el comentario."});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
