import Usuario from "../models/Usuario.model.js";
import sequelize from "../config/database.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import generateHash from "../utils/generateHash.js";
import compareHash from "../utils/compareHash.js";

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

        let imagenAvatar = undefined;
        let mimetype = undefined

        if(req.files && req.files.avatar){

            const formatosPermitidos = ["image/jpg", "image/jpeg", "image/svg", "image/webp"];
            imagenAvatar = req.files.avatar.data;
            mimetype = req.files.avatar.mimetype;

            if(!formatosPermitidos.includes(mimetype)){
                await t.rollback();
                return res.status(400).json({status:"fail", message: "Formato de imagen no permitido."});
            }
        }

        password = await generateHash(password);

        const [usuario, created] = await Usuario.findOrCreate({
            where: { email },
            defaults: {
                nombre,
                email,
                password,
                imagenAvatar,
                mimetype

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

        const usuario = await Usuario.findOne({
            where: {
                email: {
                    [Op.iLike]: email,
                },
            },
            attributes: { exclude: ["mimetype", "imagenAvatar", "fechaCreacion", "fechaActualizacion"]}
        });

        if (!usuario) {
            return res.status(404).json({
                status: "fail",
                message: "Credenciales inválidas.",
            });
        }

        const coincidePasswords = await compareHash(password, usuario.password);

        if (!coincidePasswords) {
            return res
                .status(400)
                .json({ status: "fail", message: "Credenciales inválidas" });
        }


        //EMISIÓN DE TOKEN

        const data = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            status: usuario.status,
            admin: usuario.admin
        }

        const token = jwt.sign(data, process.env.SECRETO_JWT, { expiresIn: '5m' });

        res.status(200).json({
            status: "Ok",
            message: "Login exitoso!",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor.",
        });
    }
};
