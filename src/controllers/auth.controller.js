import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";

export const registroUsuario = async (req, res) => {
    const t = await sequelize.transaction(); 
    try {
        let { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcionar los campos requeridos [nombre, email, password]",
            });
        }

        const [usuario, created] = await Usuario.findOrCreate({
            where: { email },
            defaults: {
                nombre,
                email,
                password,
            },
            transaction: t
        });

        if (!created) {
            await t.rollback();
            return res
                .status(400)
                .json({
                    status: "fail",
                    message: `Ya existe un usuario con el email: ${email}, intente recuperar su password o debe ponerse en contacto con soporte@correo.com`,
                });
        }

        await t.commit();
        res.status(201).json({
            status: "Create",
            message: "Usuario creado con éxito con id: " + usuario.id,
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
