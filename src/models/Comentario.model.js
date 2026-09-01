import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.model.js";
import Publicacion from "./Publicacion.model.js";

class Comentario extends Model {}

Comentario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        publicacionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "publicacion_id", // Mapea a la columna en la BD
            references: {
                model: Publicacion,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "usuario_id", // Mapea a la columna en la BD
            references: {
                model: Usuario,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        contenido: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El comentario no puede estar vacío.",
                },
            },
        },
    },
    {
        sequelize,
        modelName: "comentario",
        tableName: "Comentarios",
        freezeTableName: true,
        timestamps: true,
        createdAt: "fecha_creacion", // Mapea createdAt -> fecha_creacion
        updatedAt: "fecha_actualizacion", // Mapea updatedAt -> fecha_actualizacion
        underscored: true
    }
);

// Para sincronizar de forma segura sin alterar la tabla:
Comentario.sync({ force: false, alter: false });

export default Comentario;