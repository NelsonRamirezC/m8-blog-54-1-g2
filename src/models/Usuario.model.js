import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "El email no tiene el formato correcto.",
                },
            },
            set(value) {
                //estandarizamos de los emails
                let email = value.toLowerCase().trim();
                this.setDataValue("email", email);
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "usuario",
        tableName: "Usuarios", // Respeta el nombre exacto de la tabla
        freezeTableName: true, // Evita la pluralización automática
        timestamps: true, // Habilita timestamps automáticos
        createdAt: "fecha_creacion", // Mapea a tu columna fecha_creacion
        updatedAt: "fecha_actualizacion", // Mapea a tu columna fecha_actualizacion
    },
);

// Para sincronizar de forma segura sin alterar la tabla:
Usuario.sync({ force: false, alter: false });

export default Usuario;
