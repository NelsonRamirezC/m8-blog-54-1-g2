import { Sequelize } from "sequelize";
import pg from "pg";

//motor_db://usuario:password@direccion_host:puerto/nombre_db

const URI_DATABASE = process.env.URI_DATABASE;

const sequelize = new Sequelize(URI_DATABASE, {
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions:
        process.env.ENV_NODE == "production"
            ? { require: true, ssl: { rejectUnauthorized: false } }
            : {},
});

export default sequelize;
