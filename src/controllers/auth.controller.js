import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";

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
            transaction: t,
        });

        if (!created) {
            await t.rollback();
            return res.status(400).json({
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

export const loginUsuario = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message:
                    "No se proporcionar los campos requeridos [email, password]",
            });
        }

        //op. 1 email de entrada normalizado
        //email = email.toLowerCase().trim();

        const usuario = await Usuario.findOne({
            where: {
                email: {
                    [Op.iLike]: email,
                },
            },
        });

        if (!usuario || usuario.password != password) {
            return res
                .status(400)
                .json({ status: "fail", message: "Credenciales inválidas" });
        }

        res.status(200).json({
            status: "Ok",
            message: "Login exitoso!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
