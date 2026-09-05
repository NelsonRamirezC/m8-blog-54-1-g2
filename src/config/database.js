import { Sequelize } from "sequelize";

//motor_db://usuario:password@direccion_host:puerto/nombre_db

const URI_DATABASE = process.env.URI_DATABASE;

const sequelize = new Sequelize(URI_DATABASE);

export default sequelize;
